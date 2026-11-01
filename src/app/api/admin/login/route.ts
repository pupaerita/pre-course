import { NextResponse } from "next/server";
import { passwordMatches, sessionCookieOptions } from "@/lib/admin-auth";
import { isRateLimited } from "@/lib/rate-limit";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

function fail(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  // กันคนลองเดารหัสรัว ๆ (ใช้ตัวนับร่วมกับฟอร์มสมัคร แยกด้วยคีย์ login:)
  if (isRateLimited(`login:${ip}`)) {
    return fail("ลองเข้าสู่ระบบบ่อยเกินไป รอสักครู่แล้วลองใหม่", 429);
  }

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return fail("ยังไม่ได้ตั้งรหัสผ่านผู้ดูแลใน .env.local", 503);
  }

  let password = "";
  try {
    const body: unknown = await request.json();
    if (typeof body === "object" && body !== null && "password" in body && typeof body.password === "string") {
      password = body.password;
    }
  } catch {
    return fail("ข้อมูลที่ส่งมาอ่านไม่ได้", 400);
  }

  if (!passwordMatches(password)) {
    return fail("รหัสผ่านไม่ถูกต้อง", 401);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions);
  return response;
}
