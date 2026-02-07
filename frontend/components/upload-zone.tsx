"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, ImagePlus, X, CheckCircle2 } from "lucide-react";
import { cn, isValidImageFile, formatFileSize } from "@/lib/utils";

interface UploadZoneProps {
  label: string;
  sublabel: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function UploadZone({
  label,
  sublabel,
  file,
  onFileSelect,
  disabled = false,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (selectedFile: File) => {
      if (!isValidImageFile(selectedFile)) {
        return;
      }
      onFileSelect(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [disabled, handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFileSelect(null);
      setPreview(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all duration-300 cursor-pointer min-h-[220px]",
        isDragging && "upload-zone-active scale-[1.02]",
        file
          ? "border-success/50 bg-success-dim"
          : "border-border hover:border-accent/50 hover:bg-accent-dim/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {preview && file ? (
        <>
          {/* Image preview */}
          <div className="relative w-full">
            <img
              src={preview}
              alt={label}
              className="w-full max-h-[160px] object-contain rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-error/90 text-white flex items-center justify-center hover:bg-error transition-colors shadow-lg"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">
              {file.name}
            </span>
            <span className="text-xs text-muted">
              ({formatFileSize(file.size)})
            </span>
          </div>
        </>
      ) : (
        <>
          {/* Upload prompt */}
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent-dim mb-4">
            {isDragging ? (
              <Upload className="w-7 h-7 text-accent animate-bounce" />
            ) : (
              <ImagePlus className="w-7 h-7 text-accent" />
            )}
          </div>
          <p className="text-base font-semibold text-foreground mb-1">
            {label}
          </p>
          <p className="text-sm text-muted mb-3">{sublabel}</p>
          <p className="text-xs text-muted-foreground">
            {isDragging
              ? "اترك الملف هنا..."
              : "اسحب وأسقط الصورة أو انقر للاختيار"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            JPG, PNG, WebP - Max 10MB
          </p>
        </>
      )}
    </div>
  );
}
