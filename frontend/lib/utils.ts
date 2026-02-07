import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind CSS classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Unix timestamp (ms) to a readable date string */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a Unix timestamp to a short date */
export function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Truncate a string with ellipsis */
export function truncate(str: string | null | undefined, maxLength: number): string {
  if (!str) return "-";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

/** Validate that a file is an image */
export function isValidImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"];
  return validTypes.includes(file.type);
}

/** Format file size in human-readable format */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
