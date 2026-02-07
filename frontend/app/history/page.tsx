"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  History,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Eye,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  LayoutList,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { getAllResults } from "@/lib/api";
import type { IdCardRecord } from "@/lib/types";
import { cn, formatDate, truncate } from "@/lib/utils";
import { SkeletonCard, SkeletonTable } from "@/components/skeleton-card";

type ViewMode = "grid" | "table";

export default function HistoryPage() {
  const [records, setRecords] = useState<IdCardRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllResults();
      if (response.success && response.data) {
        setRecords(response.data);
      } else {
        setError(response.error || "Failed to fetch records");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch records";
      setError(message);
      toast.error("فشل في تحميل السجلات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;

    const query = searchQuery.trim().toLowerCase();
    return records.filter((record) => {
      return (
        record.name?.toLowerCase().includes(query) ||
        record.national_id?.includes(query) ||
        record.address?.toLowerCase().includes(query) ||
        record.job?.toLowerCase().includes(query)
      );
    });
  }, [records, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-dim">
            <History className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              سجل البطاقات
            </h1>
            <p className="text-sm text-muted">
              جميع البطاقات التي تم معالجتها
            </p>
          </div>
        </div>
      </div>

      {/* Search and controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الرقم القومي أو العنوان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
        </div>

        {/* View toggle and refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === "grid"
                  ? "bg-accent-dim text-accent"
                  : "text-muted hover:text-foreground"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === "table"
                  ? "bg-accent-dim text-accent"
                  : "text-muted hover:text-foreground"
              )}
              aria-label="Table view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={fetchRecords}
            disabled={loading}
            className="p-2.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-card transition-colors disabled:opacity-50"
            aria-label="Refresh"
          >
            <RefreshCw
              className={cn("w-4 h-4", loading && "animate-spin")}
            />
          </button>
        </div>
      </div>

      {/* Results count */}
      {!loading && !error && (
        <p className="text-sm text-muted mb-4">
          {filteredRecords.length === records.length
            ? `${records.length} سجل`
            : `${filteredRecords.length} من ${records.length} سجل`}
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <div>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <SkeletonTable />
          )}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="glass-card p-8 text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            حدث خطأ
          </h3>
          <p className="text-muted text-sm mb-4">{error}</p>
          <button
            onClick={fetchRecords}
            className="px-4 py-2 rounded-lg bg-accent-dim border border-accent/30 text-accent text-sm hover:bg-accent/20 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && records.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Inbox className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            لا توجد سجلات
          </h3>
          <p className="text-muted text-sm mb-6">
            لم يتم معالجة أي بطاقات بعد. ابدأ بمعالجة بطاقة من الصفحة الرئيسية.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-l from-accent to-accent-secondary text-background font-medium text-sm hover:shadow-lg hover:shadow-accent/20 transition-all"
          >
            ابدأ المعالجة
          </Link>
        </div>
      )}

      {/* No search results */}
      {!loading &&
        !error &&
        records.length > 0 &&
        filteredRecords.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Search className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-muted text-sm">
              لم يتم العثور على سجلات تطابق &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

      {/* Grid view */}
      {!loading && !error && filteredRecords.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record, index) => (
            <Link
              key={record._id}
              href={`/history/${record._id}`}
              className="glass-card p-5 hover:border-accent/30 transition-all duration-300 group block animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-dim text-accent flex-shrink-0 group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {record.name || "---"}
                    </p>
                    <p className="text-xs text-muted font-mono">
                      {record.national_id || "---"}
                    </p>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>

              <div className="space-y-2 text-xs">
                {record.address && (
                  <div className="flex items-center gap-2 text-muted">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {truncate(record.address, 40)}
                    </span>
                  </div>
                )}
                {record.date_of_birth && (
                  <div className="flex items-center gap-2 text-muted">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{record.date_of_birth}</span>
                  </div>
                )}
              </div>

              {record._creationTime && (
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-[11px] text-muted-foreground">
                    {formatDate(record._creationTime)}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Table view */}
      {!loading && !error && filteredRecords.length > 0 && viewMode === "table" && (
        <div className="glass-card overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                  الاسم
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                  الرقم القومي
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">
                  العنوان
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">
                  تاريخ الميلاد
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                  التفاصيل
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr
                  key={record._id}
                  className="border-b border-border/30 hover:bg-card-hover transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-dim text-accent flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-foreground font-medium">
                        {record.name || "---"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted font-mono flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5" />
                      {record.national_id || "---"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-muted">
                      {truncate(record.address, 30)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-muted">
                      {record.date_of_birth || "---"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/history/${record._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-dim text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      عرض
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
