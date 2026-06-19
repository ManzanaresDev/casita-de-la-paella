import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { dishes, ingredients, allergens, dishImages } from "@/app/db/schema";

export async function GET() {
  const result = await db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.position)],
    with: {
      dishes: {
        where: (d, { eq }) => eq(d.available, true),
        orderBy: (d, { asc }) => [asc(d.position)],
        with: {
          ingredients: true,
          allergens: true,
          images: {
            orderBy: (img, { asc }) => [asc(img.position)],
          },
        },
      },
    },
  });

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dish = await db.transaction(async (tx) => {
      const [insertedDish] = await tx
        .insert(dishes)
        .values({
          name: body.name,
          description: body.description,
          price: body.price,
          featured: body.featured ?? false,
          categoryId: body.categoryId,
        })
        .returning();

      if (body.ingredients?.length) {
        await tx.insert(ingredients).values(
          body.ingredients.map((name: string) => ({
            name,
            dishId: insertedDish.id,
          })),
        );
      }

      if (body.allergens?.length) {
        await tx.insert(allergens).values(
          body.allergens.map((name: string) => ({
            name,
            dishId: insertedDish.id,
          })),
        );
      }

      if (body.images?.length) {
        await tx.insert(dishImages).values(
          body.images.map(
            (img: { url: string; publicId: string }, i: number) => ({
              dishId: insertedDish.id,
              url: img.url,
              publicId: img.publicId,
              position: i,
            }),
          ),
        );
      }

      return insertedDish;
    });

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error("POST /api/dishes error:", error);
    return NextResponse.json(
      { error: "Failed to create dish" },
      { status: 500 },
    );
  }
}
