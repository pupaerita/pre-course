import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { PostForm } from "@/components/admin/post-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "เขียนบทความใหม่",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <section className="mx-auto max-w-page px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
      <AdminNav current="posts" />
      <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">เขียนบทความใหม่</h1>
      <PostForm />
    </section>
  );
}
