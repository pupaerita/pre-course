import { NextResponse } from "next/server";
import { dbFailure, readInput } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { workSchema } from "@/lib/validators";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  const input = await readInput(request, workSchema);
  if ("response" in input) return input.response;

  try {
    await db.work.update({ where: { id }, data: input.data });
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    return dbFailure(error);
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    await db.work.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbFailure(error);
  }
}
