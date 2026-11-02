import { NextResponse } from "next/server";
import { dbFailure, readInput } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { postSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const input = await readInput(request, postSchema);
  if ("response" in input) return input.response;

  try {
    const post = await db.post.create({
      data: { ...input.data, publishedAt: input.data.published ? new Date() : null },
    });
    return NextResponse.json({ ok: true, id: post.id });
  } catch (error) {
    return dbFailure(error);
  }
}
