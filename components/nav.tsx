"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/panel1", label: "1 · Unit Economics" },
  { href: "/panel2", label: "2 · Renewal Engine" },
  { href: "/panel3", label: "3 · Carrier Pitch" },
  { href: "/panel4", label: "4 · Appetite Match" },
  { href: "/assumptions", label: "Sources" },
];

export function Nav() {
  const pathname = usePathname();
  // Hide on auth pages
  if (pathname.startsWith("/auth") || pathname.startsWith("/protected")) {
    return null;
  }
  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 md:px-10 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-sm tracking-tight flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <span>Surety Economics</span>
        </Link>
        <div className="flex gap-1 overflow-x-auto">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-xs md:text-sm whitespace-nowrap transition ${
                  active
                    ? "bg-amber-500 text-slate-950 font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <a
          href="https://buysuretybonds.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline text-xs text-muted-foreground hover:text-amber-400 transition"
        >
          BuySuretyBonds.com →
        </a>
      </div>
    </nav>
  );
}
