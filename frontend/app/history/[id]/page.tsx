"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowRight,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Heart,
  Clock,
  Briefcase,
  AlertCircle,
  FileText,
  RefreshCw,
} from "lucide-react";
import { getResultById } from "@/lib/api";
import type { IdCardRecord } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const fieldConfig = [
  { key: "name", labelAr: "الاسم", labelEn: "Name", icon: User },
  {
    key: "national_id",
    labelAr: "الرقم القومي",
    labelEn: "National ID",
    icon: CreditCard,
  },
  { key: "address", labelAr: "العنوان", labelEn: "Address", icon: MapPin },
  {
    key: "date_of_birth",
    labelAr: "تاريخ الميلاد",
    labelEn: "Date of Birth",
    icon: Calendar,
  },
  { key: "gender", labelAr: "النوع", labelEn: "Gender", icon: Users },
  {
    key: "religion",
    labelAr: "الديانة",
    labelEn: "Religion",
    icon: BookOpen,
  },
  {
    key: "marital_status",
    labelAr: "الحالة الاجتماعية",
    labelEn: "Marital Status",
    icon: Heart,
  },
  {
    key: "expiry_date",
    labelAr: "تاريخ الانتهاء",
    labelEn: "Expiry Date",
    icon: Clock,
  },
  {
    key: "job",
    labelAr: "الوظيفة",
    labelEn: "Job/Profession",
    icon: Briefcase,
  },
] as const;

export default function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [record, setRecord] = useState<IdCardRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRawOcr, setShowRawOcr] = useState(false);
  const [showCorrectedText, setShowCorrectedText] = useState(false);

  const fetchRecord = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getResultById(resolvedParams.id);
      if (response.success && response.data) {
        setRecord(response.data);
      } else {
        setError(response.error || "Record not found");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch record";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-6">
          <div className="skeleton h-8 w-48 rounded-lg" />
          <div className="glass-card p-6 space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="skeleton h-4 w-48 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="glass-card p-8 text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            حدث خطأ
          </h3>
          <p className="text-muted text-sm mb-4">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={fetchRecord}
              className="px-4 py-2 rounded-lg bg-accent-dim border border-accent/30 text-accent text-sm hover:bg-accent/20 transition-colors"
            >
              إعادة المحاولة
            </button>
            <Link
              href="/history"
              className="px-4 py-2 rounded-lg bg-card border border-border text-muted text-sm hover:text-foreground hover:bg-card-hover transition-colors"
            >
              العودة للسجلات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back link */}
      <Link
        href="/history"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground text-sm mb-6 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للسجلات</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-1">
            {record.name || "بطاقة شخصية"}
          </h1>
          {record._creationTime && (
            <p className="text-sm text-muted">
              تم المعالجة: {formatDate(record._creationTime)}
            </p>
          )}
        </div>

        <button
          onClick={fetchRecord}
          className="p-2.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-card transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {/* Extracted Fields Card */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" />
            البيانات المستخرجة
          </h2>

          <div className="grid gap-3">
            {fieldConfig.map((field, index) => {
              const Icon = field.icon;
              const value =
                record[field.key as keyof IdCardRecord] as string | null;

              return (
                <div
                  key={field.key}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card/50 hover:bg-card-hover transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-accent-dim text-accent flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted mb-1">
                      {field.labelAr}{" "}
                      <span className="text-muted-foreground">
                        / {field.labelEn}
                      </span>
                    </p>
                    <p
                      className={cn(
                        "text-base font-medium",
                        value ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {value || "---"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OCR Text Section */}
        {(record.corrected_text || record.raw_ocr_text) && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              نصوص OCR
            </h2>

            <div className="space-y-4">
              {/* Corrected text */}
              {record.corrected_text && (
                <div>
                  <button
                    onClick={() => setShowCorrectedText(!showCorrectedText)}
                    className="flex items-center justify-between w-full p-3 rounded-lg bg-card/50 hover:bg-card-hover transition-colors text-right"
                  >
                    <span className="text-sm font-semibold text-accent">
                      النص المصحح / Corrected Text
                    </span>
                    <span className="text-xs text-muted">
                      {showCorrectedText ? "إخفاء" : "عرض"}
                    </span>
                  </button>
                  {showCorrectedText && (
                    <pre className="mt-2 text-xs text-muted bg-background/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto font-mono animate-fade-in">
                      {record.corrected_text}
                    </pre>
                  )}
                </div>
              )}

              {/* Raw OCR text */}
              {record.raw_ocr_text && (
                <div>
                  <button
                    onClick={() => setShowRawOcr(!showRawOcr)}
                    className="flex items-center justify-between w-full p-3 rounded-lg bg-card/50 hover:bg-card-hover transition-colors text-right"
                  >
                    <span className="text-sm font-semibold text-warning">
                      النص الخام / Raw OCR Text
                    </span>
                    <span className="text-xs text-muted">
                      {showRawOcr ? "إخفاء" : "عرض"}
                    </span>
                  </button>
                  {showRawOcr && (
                    <pre className="mt-2 text-xs text-muted bg-background/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto font-mono animate-fade-in">
                      {record.raw_ocr_text}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
