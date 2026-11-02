import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import type { z } from "zod";

export type FieldErrors = Record<string, string>;

export function fail(message: string, status: number, errors?: FieldErrors) {
  return NextResponse.json({ ok: false, message, errors }, { status });
}

// อ่าน JSON แล้วตรวจด้วย zod — ผิดที่ช่องไหนบอกกลับเป็นรายช่อง
export async function readInput<T extends z.ZodTypeAny>(
  request: Request,
  schema: T,
): Promise<{ data: z.output<T> } | { response: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { response: fail("ข้อมูลที่ส่งมาอ่านไม่ได้", 400) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { response: fail("ข้อมูลบางช่องยังไม่ถูกต้อง", 400, errors) };
  }
  return { data: parsed.data };
}

// แปลง error ของฐานข้อมูลเป็นข้อความที่คนอ่านรู้เรื่อง
export function dbFailure(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return fail("ลิงก์หน้านี้ (slug) มีคนใช้แล้ว เปลี่ยนเป็นชื่ออื่น", 409, {
        slug: "ลิงก์นี้ถูกใช้แล้ว เปลี่ยนเป็นชื่ออื่น",
      });
    }
    if (error.code === "P2025") return fail("ไม่พบรายการนี้ อาจถูกลบไปแล้ว", 404);
  }
  console.error(error);
  return fail("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง", 500);
}
