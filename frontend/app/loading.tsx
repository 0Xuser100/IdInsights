import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
        <p className="text-muted text-sm">جاري التحميل...</p>
      </div>
    </div>
  );
}
