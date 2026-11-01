import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";
import { subscribeSchema } from "@/lib/validators";

export const runtime = "nodejs";

type ErrorCode = "invalid" | "duplicate" | "rate_limited" | "server";

function fail(code: ErrorCode, message: string, status: number, fields?: Record<string, string>) {
  return NextResponse.json({ ok: false, code, message, fields }, { status });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return fail("rate_limited", "ส่งบ่อยเกินไป รอสักครู่แล้วลองใหม่", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("invalid", "ข้อมูลที่ส่งมาอ่านไม่ได้", 400);
  }

  // ช่องล่อบอต: คนจริงมองไม่เห็นจึงไม่กรอก ถ้ามีค่าแปลว่าเป็นบอต
  // ตอบเหมือนสำเร็จเพื่อไม่ให้บอตรู้ตัว แต่ไม่บันทึกอะไร
  if (typeof body === "object" && body !== null && "website" in body && body.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = issue.message;
    }
    return fail("invalid", "ข้อมูลไม่ครบหรือไม่ถูกต้อง", 400, fields);
  }

  const { name, email } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  try {
    await db.subscriber.create({
      data: { name, email: normalizedEmail, consent: true },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return fail("duplicate", "อีเมลนี้สมัครรับข่าวสารไว้แล้ว ไม่ต้องสมัครซ้ำ", 409);
    }
    console.error("[subscribe] บันทึกไม่สำเร็จ:", err instanceof Error ? err.message : err);
    return fail("server", "บันทึกไม่สำเร็จ ลองใหม่อีกครั้งในอีกสักครู่", 500);
  }

  // รอผลการส่งอีเมลด้วย เพราะบน serverless งานที่ปล่อยค้างอาจถูกตัดก่อนส่งเสร็จ
  // แต่ถ้าส่งไม่สำเร็จ ก็ยังถือว่าสมัครสำเร็จ (ข้อมูลถูกบันทึกแล้ว)
  await sendWelcomeEmail(normalizedEmail, name);

  return NextResponse.json({ ok: true }, { status: 201 });
}
