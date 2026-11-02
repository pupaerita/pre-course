import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { WorkForm } from "@/components/admin/work-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "แก้ไขผลงาน",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditWorkPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const work = await db.work.findUnique({ where: { id } });
  if (!work) notFound();

  return (
    <section className="mx-auto max-w-page px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
      <AdminNav current="works" />
      <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">แก้ไขผลงาน</h1>
      <WorkForm
        initial={{
          id: work.id,
          slug: work.slug,
          title: work.title,
          client: work.client,
          year: work.year,
          category: work.category,
          summary: work.summary,
          role: work.role,
          challenge: work.challenge,
          approach: work.approach,
          result: work.result,
          featured: work.featured,
          published: work.published,
        }}
      />
    </section>
  );
}
