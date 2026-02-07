import type {
  UploadResponse,
  ProcessResponse,
  ResultsResponse,
  SingleResultResponse,
} from "./types";

const API_BASE = "/api";
const BACKEND_URL = "http://localhost:8000";

/** Custom error class for API errors */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public detail?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Helper to handle fetch responses */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = "";
    try {
      const errorData = await response.json();
      detail = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      detail = response.statusText;
    }
    throw new ApiError(
      `Request failed: ${detail}`,
      response.status,
      detail
    );
  }
  return response.json() as Promise<T>;
}

/**
 * Upload face and back images of an Egyptian ID card.
 * POST /upload (multipart/form-data with 'face' and 'back' fields)
 */
export async function uploadImages(
  faceFile: File,
  backFile: File,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("face", faceFile);
  formData.append("back", backFile);

  // Use XMLHttpRequest for progress tracking
  if (onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new ApiError("Failed to parse upload response"));
          }
        } else {
          let detail = "";
          try {
            const errorData = JSON.parse(xhr.responseText);
            detail = errorData.detail || errorData.message || xhr.statusText;
          } catch {
            detail = xhr.statusText;
          }
          reject(new ApiError(`Upload failed: ${detail}`, xhr.status, detail));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new ApiError("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new ApiError("Upload aborted"));
      });

      xhr.open("POST", `${API_BASE}/upload`);
      xhr.send(formData);
    });
  }

  // Fallback to fetch without progress
  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<UploadResponse>(response);
}

/**
 * Process uploaded ID card images.
 * POST /process/{upload_id}
 */
export async function processIdCard(uploadId: string): Promise<ProcessResponse> {
  // Call backend directly (not through proxy) to avoid proxy timeout
  // on this long-running endpoint (Document AI + OpenAI can take 60s+)
  const response = await fetch(`${BACKEND_URL}/process/${uploadId}`, {
    method: "POST",
    signal: AbortSignal.timeout(120_000), // 2 minute timeout
  });

  return handleResponse<ProcessResponse>(response);
}

/**
 * Get all stored ID card records.
 * GET /results
 */
export async function getAllResults(): Promise<ResultsResponse> {
  const response = await fetch(`${API_BASE}/results`, {
    method: "GET",
    cache: "no-store",
  });

  return handleResponse<ResultsResponse>(response);
}

/**
 * Get a single ID card record by ID.
 * GET /results/{card_id}
 */
export async function getResultById(cardId: string): Promise<SingleResultResponse> {
  const response = await fetch(`${API_BASE}/results/${cardId}`, {
    method: "GET",
    cache: "no-store",
  });

  return handleResponse<SingleResultResponse>(response);
}

/**
 * Upload and process images in a single workflow.
 * Calls upload first, then process, reporting progress along the way.
 */
export async function uploadAndProcess(
  faceFile: File,
  backFile: File,
  callbacks: {
    onUploadProgress?: (percent: number) => void;
    onUploadComplete?: (uploadId: string) => void;
    onProcessingStart?: () => void;
    onProcessingComplete?: (data: ProcessResponse) => void;
    onError?: (error: Error) => void;
  }
): Promise<ProcessResponse> {
  try {
    // Step 1: Upload images
    const uploadResult = await uploadImages(faceFile, backFile, callbacks.onUploadProgress);
    callbacks.onUploadComplete?.(uploadResult.upload_id);

    // Step 2: Process the uploaded images
    callbacks.onProcessingStart?.();
    const processResult = await processIdCard(uploadResult.upload_id);

    if (!processResult.success) {
      throw new ApiError(processResult.error || "Processing failed");
    }

    callbacks.onProcessingComplete?.(processResult);
    return processResult;
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : new ApiError(error instanceof Error ? error.message : "Unknown error");
    callbacks.onError?.(apiError);
    throw apiError;
  }
}
