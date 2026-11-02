import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";
import { cn } from "@/lib/utils";

const ITEMS = [
  { key: "subscribers", href: "/admin", label: "ผู้สมัคร" },
  { key: "posts", href: "/admin/posts", label: "บทความ" },
  { key: "works", href: "/admin/works", label: "ผลงาน" },
] as const;

export function AdminNav({ current }: { current: (typeof ITEMS)[number]["key"] }) {
  return (
    <nav aria-label="เมนูผู้ดูแล" className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
      <ul className="flex gap-6">
        {ITEMS.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={item.key === current ? "page" : undefined}
              className={cn(
                "pb-1 text-lg",
                item.key === current ? "border-b-2 border-accent font-semibold" : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <LogoutButton />
    </nav>
  );
}
