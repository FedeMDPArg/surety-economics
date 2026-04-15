"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/panel1", label: "1 · Unit Economics" },
  { href: "/panel2", label: "2 · Renewal Engine" },
  { href: "/panel3", label: "3 · Carrier Pitch" },
  { href: "/panel4", label: "4 · Appetite Match" },
];

export function Nav() {
  const pathname = usePathname();
  // Hide on auth pages
  if (pathname.startsWith("/auth") || pathname.startsWith("/protected")) {
    return null;
  }
  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 md:px-10 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-sm tracking-tight">
          Surety Economics
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
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted"
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
          className="hidden md:inline text-xs text-muted-foreground hover:text-foreground transition"
        >
          BuySuretyBonds.com →
        </a>
      </div>
    </nav>
  );
}
