import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { dishes } from "@/app/db/schema";
import { eq } from "drizzle-orm";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: Context) {
  const { id } = await context.params;

  return NextResponse.json({
    message: "ok",
    id,
  });
}

export async function DELETE(_: NextRequest, context: Context) {
  const { id } = await context.params;

  await db.delete(dishes).where(eq(dishes.id, Number(id)));

  return NextResponse.json({ deleted: true });
}
