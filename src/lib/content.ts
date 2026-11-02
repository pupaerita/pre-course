import { db } from "@/lib/db";

// ดึงเฉพาะที่ "เผยแพร่แล้ว" — ฉบับร่างไม่หลุดขึ้นหน้าเว็บ
export function getPublishedPosts() {
  return db.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
}

export function getPublishedPost(slug: string) {
  return db.post.findFirst({ where: { slug, published: true } });
}

export function getPublishedWorks() {
  return db.work.findMany({
    where: { published: true },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
}

export function getPublishedWork(slug: string) {
  return db.work.findFirst({ where: { slug, published: true } });
}

export type PostBlock = { type: "p"; text: string } | { type: "h2"; text: string };

// แปลงเนื้อบทความเป็นบล็อก: ย่อหน้าคั่นด้วยบรรทัดว่าง · "## " นำหน้า = หัวข้อย่อย
export function parseBody(body: string): PostBlock[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): PostBlock =>
      chunk.startsWith("## ") ? { type: "h2", text: chunk.slice(3).trim() } : { type: "p", text: chunk },
    );
}

export function formatThaiDate(date: Date): string {
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  });
}
