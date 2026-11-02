import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { PostForm } from "@/components/admin/post-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "แก้ไขบทความ",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <section className="mx-auto max-w-page px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
      <AdminNav current="posts" />
      <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">แก้ไขบทความ</h1>
      <PostForm
        initial={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          tag: post.tag,
          body: post.body,
          readMinutes: post.readMinutes,
          published: post.published,
        }}
      />
    </section>
  );
}
