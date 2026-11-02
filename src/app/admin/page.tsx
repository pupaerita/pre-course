import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { ADMIN_PAGE_SIZE, formatDateTime, subscriberWhere } from "@/lib/subscribers";

export const metadata: Metadata = {
  title: "รายชื่อผู้สมัคร",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

function pageHref(q: string, page: number): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default async function AdminPage({ searchParams }: Props) {
  // ตรวจซ้ำอีกชั้น แม้ middleware ปิดทางไว้แล้ว
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { q = "", page: pageParam } = await searchParams;
  const where = subscriberWhere(q);

  const [total, all] = await Promise.all([db.subscriber.count({ where }), db.subscriber.count()]);
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1), pageCount);

  const rows = await db.subscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * ADMIN_PAGE_SIZE,
    take: ADMIN_PAGE_SIZE,
  });

  const exportHref = q ? `/api/admin/export?q=${encodeURIComponent(q)}` : "/api/admin/export";

  return (
    <section className="mx-auto max-w-page px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
      <AdminNav current="subscribers" />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">รายชื่อผู้สมัคร</h1>
        <p className="mt-2 text-muted">
          ทั้งหมด {all.toLocaleString("th-TH")} คน
          {q && <> · พบ {total.toLocaleString("th-TH")} คนที่ตรงกับ &ldquo;{q}&rdquo;</>}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-end gap-3">
        <form action="/admin" method="get" role="search" className="flex flex-1 gap-2 sm:max-w-md">
          <Input name="q" defaultValue={q} placeholder="ค้นหาชื่อหรืออีเมล" aria-label="ค้นหาชื่อหรืออีเมล" />
          <Button type="submit" variant="outline">
            ค้นหา
          </Button>
          {q && (
            <Button asChild variant="ghost">
              <Link href="/admin">ล้าง</Link>
            </Button>
          )}
        </form>
        {/* ใช้ <a> ธรรมดา เพราะเป็นการดาวน์โหลดไฟล์ ไม่ใช่การเปลี่ยนหน้า */}
        <Button asChild variant="accent">
          <a href={exportHref} download>
            ส่งออก CSV{q ? " (ตามที่ค้นหา)" : ""}
          </a>
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 border-y border-line py-10 text-muted">
          {q ? `ไม่พบรายชื่อที่ตรงกับ "${q}" ลองค้นด้วยคำอื่น หรือกดล้างการค้นหา` : "ยังไม่มีใครสมัคร เมื่อมีคนกรอกฟอร์ม รายชื่อจะขึ้นที่นี่"}
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto border-y border-line">
          <table className="w-full min-w-[40rem] text-left">
            <thead>
              <tr className="border-b border-line text-sm text-muted">
                <th scope="col" className="py-3 pr-4 font-medium">ชื่อ</th>
                <th scope="col" className="py-3 pr-4 font-medium">อีเมล</th>
                <th scope="col" className="py-3 pr-4 font-medium">ยินยอม</th>
                <th scope="col" className="py-3 font-medium">วันที่สมัคร</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-b-0">
                  <td className="py-3 pr-4">{r.name}</td>
                  <td className="py-3 pr-4 break-all">{r.email}</td>
                  <td className="py-3 pr-4">{r.consent ? "ใช่" : "ไม่"}</td>
                  <td className="py-3 text-muted">{formatDateTime(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label="เลือกหน้า" className="mt-6 flex items-center justify-between gap-4">
          {page > 1 ? (
            <Link href={pageHref(q, page - 1)} className="text-accent hover:underline">
              หน้าก่อนหน้า
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-muted">
            หน้า {page} จาก {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={pageHref(q, page + 1)} className="text-accent hover:underline">
              หน้าถัดไป
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  );
}
