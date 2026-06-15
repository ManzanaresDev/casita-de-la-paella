// app/page.tsx
import { db } from "@/app/db";
import MenuTriptych from "@/components/MenuTriptych";
import type { CategoryWithDishes } from "@/types/menu";

// Revalide le cache toutes les 60 secondes
export const revalidate = 60;

async function getMenu(): Promise<CategoryWithDishes[]> {
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
  return result as CategoryWithDishes[];
}

export default async function HomePage() {
  const categories = await getMenu();

  return (
    <main className="min-h-screen bg-stone-950 text-stone-200">
      {/* Header */}
      <header className="bg-stone-950 border-b-2 border-red-800 text-center py-10">
        <p className="text-red-600 text-xs tracking-widest uppercase mb-2">
          Le menu
        </p>
        <h1 className="font-serif text-5xl text-white tracking-widest">
          La Paëlla
        </h1>
        <p className="text-amber-600 text-xs tracking-[0.4em] uppercase mt-2 font-light">
          Authentique · Artisanale · Valenciana
        </p>
      </header>

      {/* Menu triptyque */}
      <MenuTriptych categories={categories} />

      {/* Footer */}
      <footer className="text-center py-8 text-stone-700 text-xs tracking-widest uppercase border-t border-stone-900 mt-8">
        🔥 Tout cuit au feu de bois · Fait maison · Sur commande 🔥
      </footer>
    </main>
  );
}
