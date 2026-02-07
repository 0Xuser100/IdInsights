"use client";

import {
  User,
  CreditCard,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Heart,
  Clock,
  Briefcase,
} from "lucide-react";
import type { IdCardData } from "@/lib/types";
import { ID_CARD_FIELDS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ResultsCardProps {
  data: IdCardData;
  rawOcrText?: string;
  correctedText?: string;
  showOcrText?: boolean;
  className?: string;
}

const fieldIcons: Record<string, React.ElementType> = {
  name: User,
  national_id: CreditCard,
  address: MapPin,
  date_of_birth: Calendar,
  gender: Users,
  religion: BookOpen,
  marital_status: Heart,
  expiry_date: Clock,
  job: Briefcase,
};

export function ResultsCard({
  data,
  rawOcrText,
  correctedText,
  showOcrText = false,
  className,
}: ResultsCardProps) {
  return (
    <div className={cn("space-y-4 animate-fade-in", className)}>
      {/* Extracted fields */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold gradient-text mb-5">
          البيانات المستخرجة
        </h3>
        <div className="grid gap-3">
          {ID_CARD_FIELDS.map((field, index) => {
            const Icon = fieldIcons[field.key] || User;
            const value = data[field.key];

            return (
              <div
                key={field.key}
                className="flex items-center gap-4 p-3 rounded-xl bg-card/50 hover:bg-card-hover transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-dim text-accent flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted mb-0.5">
                    {field.labelAr}{" "}
                    <span className="text-muted-foreground">
                      / {field.labelEn}
                    </span>
                  </p>
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
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

      {/* OCR Text sections */}
      {showOcrText && (rawOcrText || correctedText) && (
        <div className="glass-card p-6 space-y-4">
          {correctedText && (
            <div>
              <h4 className="text-sm font-semibold text-accent mb-2">
                النص المصحح / Corrected Text
              </h4>
              <pre className="text-xs text-muted bg-background/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
                {correctedText}
              </pre>
            </div>
          )}
          {rawOcrText && (
            <div>
              <h4 className="text-sm font-semibold text-warning mb-2">
                النص الخام / Raw OCR Text
              </h4>
              <pre className="text-xs text-muted bg-background/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
                {rawOcrText}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
