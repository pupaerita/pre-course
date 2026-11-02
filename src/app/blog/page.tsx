import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { PostList } from "@/components/post-list";
import { SubscribeBand } from "@/components/subscribe-band";
import { getPublishedPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "บทความ",
  description: "บทความเรื่องการเล่าเรื่องแบรนด์ แผนเนื้อหา และเบื้องหลังการทำงาน",
};

// อ่านจากฐานข้อมูลทุกครั้ง เพื่อให้บทความที่เพิ่งเผยแพร่ขึ้นทันที
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHeading
        title="บทความ"
        intro="เรื่องการเล่าเรื่องแบรนด์ การวางแผนเนื้อหา และสิ่งที่ได้เรียนรู้จากการทำงานจริง"
      />
      <section className="mx-auto max-w-page px-5 sm:px-8">
        <PostList items={posts} />
      </section>
      <SubscribeBand />
    </>
  );
}
