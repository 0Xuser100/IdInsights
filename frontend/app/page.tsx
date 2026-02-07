"use client";

import { useState, useCallback } from "react";
import {
  ScanLine,
  Shield,
  Zap,
  Database,
  ArrowDown,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { UploadZone } from "@/components/upload-zone";
import { ProcessingStatus } from "@/components/processing-status";
import { ResultsCard } from "@/components/results-card";
import { uploadAndProcess } from "@/lib/api";
import type { ProcessingStep, ProcessResponse } from "@/lib/types";

export default function HomePage() {
  const [faceFile, setFaceFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOcrText, setShowOcrText] = useState(false);

  const isReady = faceFile !== null && backFile !== null;
  const isProcessing =
    processingStep === "uploading" || processingStep === "processing";

  const handleProcess = useCallback(async () => {
    if (!faceFile || !backFile) return;

    setProcessingStep("uploading");
    setUploadProgress(0);
    setResult(null);
    setError(null);

    try {
      const processResult = await uploadAndProcess(faceFile, backFile, {
        onUploadProgress: (percent) => {
          setUploadProgress(percent);
        },
        onUploadComplete: () => {
          setProcessingStep("processing");
        },
        onProcessingStart: () => {
          setProcessingStep("processing");
        },
        onProcessingComplete: (data) => {
          setProcessingStep("complete");
          setResult(data);
          toast.success("تم استخراج البيانات بنجاح");
        },
        onError: (err) => {
          setProcessingStep("error");
          setError(err.message);
          toast.error("حدث خطأ أثناء المعالجة");
        },
      });

      if (processResult.success) {
        setProcessingStep("complete");
        setResult(processResult);
      }
    } catch {
      // Error is already handled by callbacks
    }
  }, [faceFile, backFile]);

  const handleReset = useCallback(() => {
    setFaceFile(null);
    setBackFile(null);
    setProcessingStep("idle");
    setUploadProgress(0);
    setResult(null);
    setError(null);
    setShowOcrText(false);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Hero content */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-dim border border-accent/20 text-accent text-sm mb-6">
              <ScanLine className="w-4 h-4" />
              <span>Powered by Google Document AI & OpenAI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="gradient-text">ماسح البطاقة الشخصية</span>
              <br />
              <span className="text-foreground">المصرية</span>
            </h1>

            <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              استخراج البيانات من البطاقة الشخصية المصرية باستخدام تقنيات الذكاء
              الاصطناعي المتقدمة. قم برفع صورة الوجه والخلفية للبدء.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <FeatureBadge
                icon={Zap}
                text="معالجة سريعة"
              />
              <FeatureBadge
                icon={Shield}
                text="آمن وموثوق"
              />
              <FeatureBadge
                icon={Database}
                text="حفظ تلقائي"
              />
            </div>
          </div>

          {/* Scroll indicator */}
          {processingStep === "idle" && !result && (
            <div className="flex justify-center mb-8 animate-bounce">
              <ArrowDown className="w-5 h-5 text-muted" />
            </div>
          )}

          {/* Upload Section */}
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  رفع الصور
                </h2>
                {(faceFile || backFile || result) && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-card transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة</span>
                  </button>
                )}
              </div>

              {/* Upload zones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <UploadZone
                  label="صورة الوجه (الأمام)"
                  sublabel="الجانب الذي يحتوي على الصورة الشخصية"
                  file={faceFile}
                  onFileSelect={setFaceFile}
                  disabled={isProcessing}
                />
                <UploadZone
                  label="صورة الخلفية (العنوان)"
                  sublabel="الجانب الذي يحتوي على العنوان"
                  file={backFile}
                  onFileSelect={setBackFile}
                  disabled={isProcessing}
                />
              </div>

              {/* Process button */}
              <button
                onClick={handleProcess}
                disabled={!isReady || isProcessing}
                className="w-full mt-6 py-4 rounded-xl text-lg font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-l from-accent to-accent-secondary text-background hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isProcessing
                  ? "جاري المعالجة..."
                  : "معالجة البطاقة"}
              </button>
            </div>

            {/* Processing status */}
            <ProcessingStatus
              currentStep={processingStep}
              uploadProgress={uploadProgress}
              error={error}
            />

            {/* Results */}
            {result?.data && processingStep === "complete" && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold gradient-text">
                    النتائج
                  </h2>
                  <button
                    onClick={() => setShowOcrText(!showOcrText)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-card transition-colors"
                  >
                    {showOcrText ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span>
                      {showOcrText ? "إخفاء النص" : "عرض النص الخام"}
                    </span>
                  </button>
                </div>

                <ResultsCard
                  data={result.data}
                  rawOcrText={result.raw_ocr_text}
                  correctedText={result.corrected_text}
                  showOcrText={showOcrText}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureBadge({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-muted">
      <Icon className="w-3.5 h-3.5 text-accent" />
      <span>{text}</span>
    </div>
  );
}
