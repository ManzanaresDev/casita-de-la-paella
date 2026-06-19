// app/admin/dishes/[id]/edit/page.tsx
import DishForm from "@/components/DishForm";
import { db } from "@/app/db";
import { asc, eq } from "drizzle-orm";
import { dishes, ingredients, allergens } from "@/app/db/schema";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDishPage({ params }: Props) {
  const { id } = await params;
  const dishId = parseInt(id);

  const [dish, cats, existingIngredients, existingAllergens] =
    await Promise.all([
      db.query.dishes.findFirst({
        where: eq(dishes.id, dishId),
        with: { ingredients: true, allergens: true, images: true }, // ← ajout
      }),
      db.query.categories.findMany({
        orderBy: (c, { asc }) => [asc(c.position)],
      }),
      db
        .select({ name: ingredients.name })
        .from(ingredients)
        .orderBy(asc(ingredients.name)),
      db
        .select({ name: allergens.name })
        .from(allergens)
        .orderBy(asc(allergens.name)),
    ]);

  if (!dish) notFound();

  return (
    <DishForm
      mode="edit"
      initial={dish}
      categories={cats.map((c) => ({ id: c.id, label: c.label }))}
      existingIngredients={existingIngredients.map((i) => i.name)}
      existingAllergens={existingAllergens.map((a) => a.name)}
    />
  );
}
