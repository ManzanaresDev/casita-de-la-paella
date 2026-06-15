import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { dishes } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const id = parseInt(params.id);

  const [dish] = await db
    .update(dishes)
    .set({
      name: body.name,
      description: body.description,
      price: body.price,
      emoji: body.emoji,
      available: body.available,
      featured: body.featured,
      updatedAt: new Date(),
    })
    .where(eq(dishes.id, id))
    .returning();

  return NextResponse.json(dish);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);

  // Le CASCADE défini dans le schéma supprime automatiquement
  // les ingredients et allergens liés à ce plat.
  await db.delete(dishes).where(eq(dishes.id, id));

  return NextResponse.json({ deleted: true });
}
