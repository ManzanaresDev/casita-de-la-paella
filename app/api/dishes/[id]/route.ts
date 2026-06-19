// app/api/dishes/[id]/route.ts
import { db } from "@/app/db";
import { dishes, dishImages } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const dishId = parseInt(id);
  const body = await req.json();
  const { name, description, price, categoryId, images } = body;
  // ... ta logique existante pour ingredients/allergens reste inchangée

  await db.transaction(async (tx) => {
    await tx
      .update(dishes)
      .set({ name, description, price, categoryId })
      .where(eq(dishes.id, dishId));

    // Remplace toutes les images existantes par le nouveau set
    await tx.delete(dishImages).where(eq(dishImages.dishId, dishId));

    if (images?.length) {
      await tx.insert(dishImages).values(
        images.map((img: { url: string; publicId: string }, i: number) => ({
          dishId,
          url: img.url,
          publicId: img.publicId,
          position: i,
        })),
      );
    }
  });

  return Response.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(dishes).where(eq(dishes.id, parseInt(id)));
  return NextResponse.json({ ok: true });
}
