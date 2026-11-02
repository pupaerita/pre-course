import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { formatThaiDate } from "@/lib/content";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "จัดการบทความ",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const posts = await db.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <section className="mx-auto max-w-page px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
      <AdminNav current="posts" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">บทความ</h1>
          <p className="mt-2 text-muted">ทั้งหมด {posts.length} เรื่อง · ฉบับร่างจะไม่ขึ้นหน้าเว็บจนกว่าจะกดเผยแพร่</p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/posts/new">เขียนบทความใหม่</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 border-y border-line py-10 text-muted">ยังไม่มีบทความ กด &ldquo;เขียนบทความใหม่&rdquo; เพื่อเริ่ม</p>
      ) : (
        <ul className="mt-8 border-t border-line">
          {posts.map((p) => (
            <li key={p.id} className="border-b border-line">
              <Link href={`/admin/posts/${p.id}`} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                <span className="text-lg font-medium group-hover:text-accent">{p.title}</span>
                <span className="flex items-center gap-4 text-sm text-muted">
                  {p.published && p.publishedAt ? <span>เผยแพร่ {formatThaiDate(p.publishedAt)}</span> : null}
                  <span
                    className={
                      p.published
                        ? "rounded-full bg-accent-soft px-3 py-0.5 font-medium text-accent"
                        : "rounded-full border border-line px-3 py-0.5"
                    }
                  >
                    {p.published ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
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
