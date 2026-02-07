import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent-dim mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-3">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          الصفحة غير موجودة
        </h2>
        <p className="text-muted text-sm mb-8 max-w-md mx-auto">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-accent to-accent-secondary text-background font-semibold text-sm hover:shadow-lg hover:shadow-accent/20 transition-all"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
