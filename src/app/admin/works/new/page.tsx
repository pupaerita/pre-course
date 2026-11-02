import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { WorkForm } from "@/components/admin/work-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "เพิ่มผลงานใหม่",
  robots: { index: false, follow: false },
};

export default async function NewWorkPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <section className="mx-auto max-w-page px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
      <AdminNav current="works" />
      <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">เพิ่มผลงานใหม่</h1>
      <WorkForm />
    </section>
  );
}
