"use client";

import { Upload, Cpu, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { ProcessingStep } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProcessingStatusProps {
  currentStep: ProcessingStep;
  uploadProgress: number;
  error?: string | null;
}

const steps = [
  {
    id: "uploading" as const,
    label: "رفع الصور",
    labelEn: "Uploading Images",
    icon: Upload,
  },
  {
    id: "processing" as const,
    label: "معالجة البطاقة",
    labelEn: "Processing ID Card",
    icon: Cpu,
  },
  {
    id: "complete" as const,
    label: "اكتملت المعالجة",
    labelEn: "Complete",
    icon: CheckCircle2,
  },
];

function getStepStatus(
  stepId: string,
  currentStep: ProcessingStep
): "pending" | "active" | "complete" | "error" {
  const stepOrder = ["uploading", "processing", "complete"];
  const currentIndex = stepOrder.indexOf(currentStep);
  const stepIndex = stepOrder.indexOf(stepId);

  if (currentStep === "error") return stepIndex <= currentIndex ? "error" : "pending";
  if (currentStep === "complete") return "complete";
  if (stepIndex < currentIndex) return "complete";
  if (stepIndex === currentIndex) return "active";
  return "pending";
}

export function ProcessingStatus({
  currentStep,
  uploadProgress,
  error,
}: ProcessingStatusProps) {
  if (currentStep === "idle") return null;

  return (
    <div className="glass-card p-6 animate-slide-up">
      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, currentStep);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                    status === "complete" &&
                      "bg-success-dim border-success text-success",
                    status === "active" &&
                      "bg-accent-dim border-accent text-accent animate-pulse-glow",
                    status === "pending" &&
                      "bg-card border-border text-muted",
                    status === "error" &&
                      "bg-error-dim border-error text-error"
                  )}
                >
                  {status === "complete" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : status === "active" ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : status === "error" ? (
                    <XCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium text-center",
                    status === "complete" && "text-success",
                    status === "active" && "text-accent",
                    status === "pending" && "text-muted",
                    status === "error" && "text-error"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 w-12 sm:w-20 h-[2px] mx-2 -mt-6">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      getStepStatus(steps[index + 1].id, currentStep) !== "pending"
                        ? "bg-accent"
                        : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload progress bar */}
      {currentStep === "uploading" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">جاري رفع الصور...</span>
            <span className="text-accent font-mono">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-accent to-accent-secondary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Processing message */}
      {currentStep === "processing" && (
        <div className="text-center space-y-2">
          <p className="text-muted text-sm">
            جاري تحليل البطاقة باستخدام الذكاء الاصطناعي...
          </p>
          <p className="text-muted-foreground text-xs">
            Document AI &rarr; OCR Correction &rarr; Field Extraction
          </p>
        </div>
      )}

      {/* Success message */}
      {currentStep === "complete" && (
        <div className="text-center">
          <p className="text-success text-sm font-medium">
            تم استخراج البيانات بنجاح
          </p>
        </div>
      )}

      {/* Error message */}
      {currentStep === "error" && error && (
        <div className="mt-2 p-3 rounded-lg bg-error-dim border border-error/30">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
