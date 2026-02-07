import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdInsights - Egyptian National ID Scanner",
  description:
    "Scan and extract structured data from Egyptian National ID cards using AI-powered OCR",
  keywords: [
    "Egyptian ID",
    "National ID",
    "OCR",
    "Document AI",
    "ID Scanner",
    "بطاقة شخصية",
    "الرقم القومي",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-gradient-main antialiased min-h-screen">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(15, 15, 35, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#f0f0f5",
              backdropFilter: "blur(12px)",
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
