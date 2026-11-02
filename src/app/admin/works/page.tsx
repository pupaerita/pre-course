import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "จัดการผลงาน",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminWorksPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const works = await db.work.findMany({ orderBy: [{ year: "desc" }, { createdAt: "desc" }] });

  return (
    <section className="mx-auto max-w-page px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
      <AdminNav current="works" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">ผลงาน</h1>
          <p className="mt-2 text-muted">ทั้งหมด {works.length} ชิ้น · ฉบับร่างจะไม่ขึ้นหน้าเว็บจนกว่าจะกดเผยแพร่</p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/works/new">เพิ่มผลงานใหม่</Link>
        </Button>
      </div>

      {works.length === 0 ? (
        <p className="mt-10 border-y border-line py-10 text-muted">ยังไม่มีผลงาน กด &ldquo;เพิ่มผลงานใหม่&rdquo; เพื่อเริ่ม</p>
      ) : (
        <ul className="mt-8 border-t border-line">
          {works.map((w) => (
            <li key={w.id} className="border-b border-line">
              <Link href={`/admin/works/${w.id}`} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                <span className="text-lg font-medium group-hover:text-accent">
                  {w.title} <span className="text-sm font-normal text-muted">· {w.year}</span>
                </span>
                <span className="flex items-center gap-4 text-sm text-muted">
                  {w.featured && <span>หน้าแรก</span>}
                  <span
                    className={
                      w.published
                        ? "rounded-full bg-accent-soft px-3 py-0.5 font-medium text-accent"
                        : "rounded-full border border-line px-3 py-0.5"
                    }
                  >
                    {w.published ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
