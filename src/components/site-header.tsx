"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-5 sm:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight" onClick={() => setOpen(false)}>
          {site.name}
        </Link>

        <nav aria-label="เมนูหลัก" className="hidden gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-[0.95rem] transition-colors hover:bg-accent-soft",
                isActive(pathname, item.href) ? "font-semibold text-accent" : "text-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="-mr-2 rounded-md px-3 py-2 text-[0.95rem] font-medium hover:bg-accent-soft md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "ปิด" : "เมนู"}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="เมนูหลัก" className="border-t border-line bg-paper md:hidden">
          <ul className="mx-auto max-w-page px-5 py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "block border-b border-line py-3 text-lg last:border-b-0",
                    isActive(pathname, item.href) ? "font-semibold text-accent" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
