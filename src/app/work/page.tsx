import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { WorkList } from "@/components/work-list";
import { works } from "@/data/works";

export const metadata: Metadata = {
  title: "ผลงาน",
  description: "ตัวอย่างงานให้คำปรึกษา เวิร์กชอป และแนวทางการเขียนให้แบรนด์เล็ก",
};

export default function WorkPage() {
  return (
    <>
      <PageHeading
        title="ผลงาน"
        intro="งานที่ทำกับร้านค้า ทีม และครีเอเตอร์ เรียงจากล่าสุด คลิกเพื่ออ่านว่าเริ่มจากโจทย์อะไรและจบอย่างไร"
      />
      <section className="mx-auto max-w-page px-5 sm:px-8">
        <WorkList items={[...works].sort((a, b) => b.year.localeCompare(a.year))} />
      </section>
    </>
  );
}
