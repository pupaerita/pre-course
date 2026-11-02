import { PrismaClient } from "@prisma/client";
import { posts } from "../src/data/posts";
import { works } from "../src/data/works";

const prisma = new PrismaClient();

// รายชื่อตัวอย่าง (อีเมลสมมติ @example.com) — รันซ้ำได้ ไม่ซ้อนกัน
// ลบออกได้ทุกเมื่อก่อนเปิดใช้งานจริง
const samples = [
  { name: "ตัวอย่าง หนึ่ง", email: "sample.one@example.com" },
  { name: "ตัวอย่าง สอง", email: "sample.two@example.com" },
  { name: "ตัวอย่าง สาม", email: "sample.three@example.com" },
];

async function main() {
  for (const s of samples) {
    await prisma.subscriber.upsert({
      where: { email: s.email },
      update: {},
      create: { ...s, consent: true },
    });
  }
  console.log(`seed เสร็จ: ${samples.length} รายชื่อตัวอย่าง`);

  // บทความ/ผลงานตั้งต้น — upsert แบบ update ว่าง: รันซ้ำไม่ทับสิ่งที่แก้ใน /admin แล้ว
  for (const p of posts) {
    const body = p.body.map((b) => (b.type === "h2" ? `## ${b.text}` : b.text)).join("\n\n");
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        tag: p.tag,
        body,
        readMinutes: p.readMinutes,
        published: true,
        publishedAt: new Date(`${p.date}T00:00:00Z`),
      },
    });
  }
  console.log(`seed เสร็จ: ${posts.length} บทความตั้งต้น`);

  // ไล่เวลา createdAt ถอยหลังทีละวินาที ให้ลำดับในไฟล์ = ลำดับบนเว็บ (ปีเดียวกัน)
  const now = Date.now();
  for (const [i, w] of works.entries()) {
    await prisma.work.upsert({
      where: { slug: w.slug },
      update: {},
      create: { ...w, published: true, createdAt: new Date(now - i * 1000) },
    });
  }
  console.log(`seed เสร็จ: ${works.length} ผลงานตั้งต้น`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
