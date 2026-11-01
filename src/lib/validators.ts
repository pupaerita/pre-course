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
