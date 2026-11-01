import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { toCsv } from "@/lib/csv";
import { db } from "@/lib/db";
import { subscriberWhere } from "@/lib/subscribers";

export const runtime = "nodejs";

function bangkokTimestamp(date: Date): string {
  // รูปแบบ 2026-10-28 22:30:00 — Excel/Sheets อ่านเป็นวันที่ได้
  return date.toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" });
}

export async function GET(request: Request) {
  // ตรวจซ้ำอีกชั้น แม้ middleware ปิดทางไว้แล้ว
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, message: "ต้องเข้าสู่ระบบก่อน" }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q") ?? "";
  const rows = await db.subscriber.findMany({
    where: subscriberWhere(q),
    orderBy: { createdAt: "desc" },
    select: { name: true, email: true, consent: true, createdAt: true },
  });

  const csv = toCsv([
    ["ชื่อ", "อีเมล", "ยินยอมรับข่าวสาร", "วันที่สมัคร"],
    ...rows.map((r) => [r.name, r.email, r.consent ? "ใช่" : "ไม่", bangkokTimestamp(r.createdAt)]),
  ]);

  const day = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Bangkok" });
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${day}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
