/** Data extracted from an Egyptian National ID card */
export interface IdCardData {
  name: string | null;
  national_id: string | null;
  address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  religion: string | null;
  marital_status: string | null;
  expiry_date: string | null;
  job: string | null;
}

/** Response from POST /upload */
export interface UploadResponse {
  upload_id: string;
  face_path: string;
  back_path: string;
}

/** Response from POST /process/{upload_id} */
export interface ProcessResponse {
  success: boolean;
  data?: IdCardData;
  raw_ocr_text?: string;
  corrected_text?: string;
  error?: string;
}

/** A stored ID card record from the database */
export interface IdCardRecord {
  _id: string;
  face_image_path?: string;
  back_image_path?: string;
  name?: string | null;
  national_id?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  religion?: string | null;
  marital_status?: string | null;
  expiry_date?: string | null;
  job?: string | null;
  raw_ocr_text?: string | null;
  corrected_text?: string | null;
  _creationTime?: number;
}

/** Response from GET /results */
export interface ResultsResponse {
  success: boolean;
  data?: IdCardRecord[];
  error?: string;
}

/** Response from GET /results/{card_id} */
export interface SingleResultResponse {
  success: boolean;
  data?: IdCardRecord;
  error?: string;
}

/** Field definition for displaying extracted data */
export interface FieldDefinition {
  key: keyof IdCardData;
  labelAr: string;
  labelEn: string;
  icon?: string;
}

/** All extractable fields from an Egyptian ID card */
export const ID_CARD_FIELDS: FieldDefinition[] = [
  { key: "name", labelAr: "الاسم", labelEn: "Name" },
  { key: "national_id", labelAr: "الرقم القومي", labelEn: "National ID" },
  { key: "address", labelAr: "العنوان", labelEn: "Address" },
  { key: "date_of_birth", labelAr: "تاريخ الميلاد", labelEn: "Date of Birth" },
  { key: "gender", labelAr: "النوع", labelEn: "Gender" },
  { key: "religion", labelAr: "الديانة", labelEn: "Religion" },
  { key: "marital_status", labelAr: "الحالة الاجتماعية", labelEn: "Marital Status" },
  { key: "expiry_date", labelAr: "تاريخ الانتهاء", labelEn: "Expiry Date" },
  { key: "job", labelAr: "الوظيفة", labelEn: "Job/Profession" },
];

/** Processing step for the upload workflow */
export type ProcessingStep = "idle" | "uploading" | "processing" | "complete" | "error";
