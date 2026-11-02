import { NextResponse } from "next/server";
import { dbFailure, fail, readInput } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { postSchema } from "@/lib/validators";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  const input = await readInput(request, postSchema);
  if ("response" in input) return input.response;

  try {
    const existing = await db.post.findUnique({ where: { id }, select: { publishedAt: true } });
    if (!existing) return fail("ไม่พบบทความนี้ อาจถูกลบไปแล้ว", 404);

    // วันที่เผยแพร่ตั้งครั้งแรกที่กดเผยแพร่ แล้วคงเดิม แม้ยกเลิกแล้วเผยแพร่ใหม่
    const publishedAt = input.data.published ? (existing.publishedAt ?? new Date()) : existing.publishedAt;
    await db.post.update({ where: { id }, data: { ...input.data, publishedAt } });
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    return dbFailure(error);
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    await db.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbFailure(error);
  }
}
