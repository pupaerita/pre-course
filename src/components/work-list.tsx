import Link from "next/link";
import type { Work } from "@/data/works";

// รายการผลงานแบบแถว (ไม่ใช้การ์ด) — ใช้ทั้งหน้าแรกและหน้าผลงาน
export function WorkList({ items }: { items: Work[] }) {
  return (
    <ul className="border-t border-line">
      {items.map((work) => (
        <li key={work.slug} className="border-b border-line">
          <Link
            href={`/work/${work.slug}`}
            className="group grid gap-x-8 gap-y-1 py-7 sm:grid-cols-[5rem_1fr_13rem] sm:items-baseline"
          >
            <span className="text-muted">{work.year}</span>
            <span>
              <span className="block text-xl font-semibold group-hover:text-accent sm:text-2xl">
                {work.title}
              </span>
              <span className="mt-1 block max-w-prose text-muted">{work.summary}</span>
            </span>
            <span className="text-muted sm:text-right">{work.category}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
