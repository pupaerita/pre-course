import { NextResponse } from "next/server";
import { dbFailure, readInput } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { workSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const input = await readInput(request, workSchema);
  if ("response" in input) return input.response;

  try {
    const work = await db.work.create({ data: input.data });
    return NextResponse.json({ ok: true, id: work.id });
  } catch (error) {
    return dbFailure(error);
  }
}
