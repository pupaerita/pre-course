import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { PostList } from "@/components/post-list";
import { SubscribeBand } from "@/components/subscribe-band";
import { posts } from "@/data/posts";

export const metadata: Metadata = {
  title: "บทความ",
  description: "บทความเรื่องการเล่าเรื่องแบรนด์ แผนเนื้อหา และเบื้องหลังการทำงาน",
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeading
        title="บทความ"
        intro="เรื่องการเล่าเรื่องแบรนด์ การวางแผนเนื้อหา และสิ่งที่ได้เรียนรู้จากการทำงานจริง"
      />
      <section className="mx-auto max-w-page px-5 sm:px-8">
        <PostList items={sorted} />
      </section>
      <SubscribeBand />
    </>
  );
}
