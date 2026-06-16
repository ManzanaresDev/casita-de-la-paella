import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { dishes, ingredients, allergens } from "@/app/db/schema";

export async function GET() {
  // Drizzle Relational Query — récupère tout en une seule passe
  const result = await db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.position)],
    with: {
      dishes: {
        where: (d, { eq }) => eq(d.available, true),
        orderBy: (d, { asc }) => [asc(d.position)],
        with: {
          ingredients: true,
          allergens: true,
        },
      },
    },
  });

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const [dish] = await db
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
      await db
        .insert(ingredients)
        .values(
          body.ingredients.map((name: string) => ({ name, dishId: dish.id })),
        );
    }

    if (body.allergens?.length) {
      await db
        .insert(allergens)
        .values(
          body.allergens.map((name: string) => ({ name, dishId: dish.id })),
        );
    }

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error("POST /api/dishes error:", error);
    return NextResponse.json(
      { error: "Failed to create dish" },
      { status: 500 },
    );
  }
}
