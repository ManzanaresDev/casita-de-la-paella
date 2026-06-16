// app/api/dishes/[id]/route.ts
import { db } from "@/app/db";
import { dishes, ingredients, allergens } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const dishId = parseInt(id);
  const body = await req.json();

  await db.transaction(async (tx) => {
    // 1. Mettre à jour les champs scalaires du plat
    await tx
      .update(dishes)
      .set({
        name: body.name,
        description: body.description,
        price: body.price,
        categoryId: body.categoryId,
        updatedAt: new Date(),
      })
      .where(eq(dishes.id, dishId));

    // 2. Remplacer les ingrédients (delete + re-insert avec dishId)
    await tx.delete(ingredients).where(eq(ingredients.dishId, dishId));
    if ((body.ingredients as string[])?.length) {
      await tx.insert(ingredients).values(
        (body.ingredients as string[]).map((name: string) => ({
          name,
          dishId,
        })),
      );
    }

    // 3. Remplacer les allergènes (delete + re-insert avec dishId)
    await tx.delete(allergens).where(eq(allergens.dishId, dishId));
    if ((body.allergens as string[])?.length) {
      await tx.insert(allergens).values(
        (body.allergens as string[]).map((name: string) => ({
          name,
          dishId,
        })),
      );
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(dishes).where(eq(dishes.id, parseInt(id)));
  return NextResponse.json({ ok: true });
}
