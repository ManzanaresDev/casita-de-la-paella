// app/admin/dishes/new/page.tsx
import DishForm from "@/components/DishForm";
import { db } from "@/app/db";
import { asc } from "drizzle-orm";
import { ingredients, allergens } from "@/app/db/schema";

export default async function NewDishPage() {
  const [cats, existingIngredients, existingAllergens] = await Promise.all([
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

  return (
    <DishForm
      mode="add"
      categories={cats.map((c) => ({ id: c.id, label: c.label }))}
      existingIngredients={existingIngredients.map((i) => i.name)}
      existingAllergens={existingAllergens.map((a) => a.name)}
    />
  );
}
