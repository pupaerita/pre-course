import type { Prisma } from "@prisma/client";

export const ADMIN_PAGE_SIZE = 20;

// เงื่อนไขค้นหาชื่อหรืออีเมล — ใช้ร่วมกันทั้งหน้ารายชื่อและไฟล์ CSV เพื่อให้ผลตรงกัน
// หมายเหตุ: อีเมลเก็บเป็นตัวพิมพ์เล็กเสมอ จึงแปลงคำค้นเป็นตัวพิมพ์เล็กสำหรับอีเมล
// ช่องชื่อใช้ mode: "insensitive" ให้ค้นหาไม่สนตัวพิมพ์เล็ก/ใหญ่ (Postgres รองรับ)
export function subscriberWhere(query: string): Prisma.SubscriberWhereInput {
  const q = query.trim();
  if (!q) return {};
  return {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q.toLowerCase() } },
    ],
  };
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  });
}
