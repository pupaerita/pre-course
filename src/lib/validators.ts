import { z } from "zod";

// กติกาตรวจฟอร์มสมัครรับข่าวสาร — เฟส 2 จะใช้ชุดเดียวกันนี้ฝั่ง server
export const subscribeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "กรอกชื่อของคุณ")
    .max(80, "ชื่อยาวเกินไป ใช้ไม่เกิน 80 ตัวอักษร"),
  email: z
    .string()
    .trim()
    .min(1, "กรอกอีเมลของคุณ")
    .max(120, "อีเมลยาวเกินไป")
    .email("อีเมลนี้ดูไม่ถูกต้อง ลองตรวจตัวสะกดอีกครั้ง"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "ติ๊กยินยอมก่อน เราจะได้ส่งข่าวสารให้คุณได้" }),
  }),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type SubscribeField = keyof SubscribeInput;

// ---- ฟอร์มจัดการบทความ/ผลงานใน admin (ตรวจฝั่ง server เสมอ) ----

const slugField = z
  .string()
  .trim()
  .min(1, "กรอกลิงก์หน้า (slug)")
  .max(80, "ลิงก์ยาวเกินไป ใช้ไม่เกิน 80 ตัวอักษร")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ใช้ได้แค่ตัวอักษรอังกฤษพิมพ์เล็ก ตัวเลข และขีดกลาง เช่น my-first-post");

function text(label: string, max: number) {
  return z
    .string()
    .trim()
    .min(1, `กรอก${label}`)
    .max(max, `${label}ยาวเกินไป ใช้ไม่เกิน ${max} ตัวอักษร`);
}

export const postSchema = z.object({
  slug: slugField,
  title: text("หัวข้อ", 150),
  excerpt: text("คำโปรย", 300),
  tag: text("หมวด", 40),
  body: text("เนื้อหา", 30000),
  readMinutes: z.coerce
    .number({ invalid_type_error: "ใส่เป็นตัวเลข" })
    .int("ใส่เป็นจำนวนเต็ม")
    .min(1, "อย่างน้อย 1 นาที")
    .max(120, "ไม่เกิน 120 นาที"),
  published: z.boolean(),
});

export const workSchema = z.object({
  slug: slugField,
  title: text("ชื่อผลงาน", 150),
  client: text("ชื่อลูกค้า", 100),
  year: z.string().trim().regex(/^\d{4}$/, "ใส่ปีเป็นเลข 4 หลัก เช่น 2567"),
  category: text("ประเภทงาน", 60),
  summary: text("สรุปสั้น", 300),
  role: text("บทบาท", 100),
  challenge: text("โจทย์", 2000),
  // กรอกหนึ่งบรรทัดต่อหนึ่งขั้นตอน
  approach: z
    .string()
    .transform((s) =>
      s
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(z.string().max(500, "แต่ละข้อยาวเกินไป ใช้ไม่เกิน 500 ตัวอักษร"))
        .min(1, "กรอกสิ่งที่ทำอย่างน้อย 1 ข้อ")
        .max(20, "ไม่เกิน 20 ข้อ"),
    ),
  result: text("ผลที่ได้", 2000),
  featured: z.boolean(),
  published: z.boolean(),
});

export type PostInput = z.infer<typeof postSchema>;
export type WorkInput = z.infer<typeof workSchema>;
