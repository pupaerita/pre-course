import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { PageHeading } from "@/components/page-heading";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบผู้ดูแล",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");

  return (
    <>
      <PageHeading title="เข้าสู่ระบบผู้ดูแล" intro="หน้านี้สำหรับเจ้าของเว็บเพื่อดูรายชื่อผู้สมัครรับข่าวสาร" />
      <section className="mx-auto max-w-page px-5 sm:px-8">
        <LoginForm />
      </section>
    </>
  );
}
