"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanLine, History, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "الرئيسية", labelEn: "Home", icon: Home },
  { href: "/history", label: "السجلات", labelEn: "History", icon: History },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-dim border border-accent/30 group-hover:border-accent/60 transition-colors">
              <ScanLine className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold gradient-text leading-tight">
                IdInsights
              </span>
              <span className="text-[10px] text-muted leading-tight hidden sm:block">
                Egyptian ID Scanner
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent-dim text-accent border border-accent/30"
                      : "text-muted hover:text-foreground hover:bg-card"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
