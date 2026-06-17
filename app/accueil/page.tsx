// app/page.tsx
import Image from "next/image";
import { db } from "@/app/db";
import MenuTriptych from "@/components/MenuTriptych";
import MobileMenuShell from "@/components/MobileMenuShell";
import type { CategoryWithDishes } from "@/types/menu";

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

export default async function AccueilPage() {
  const categories = await getMenu();
  const steamParticles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: 20 + i * 3,
    top: -10 - i * 2,
    delay: i * 0.4,
  }));

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="md:hidden bg-linear-to-r from-stone-950 to-stone-700 border-b-2 text-stone-200 border-red-800">
        <MobileMenuShell categories={categories} steamParticles={steamParticles} />
      </div>

      {/* ── DESKTOP HEADER ── */}
      <header className="hidden md:block bg-linear-to-r from-stone-950 to-stone-700 border-b-2 text-stone-200 border-red-800 py-3">
        <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-6">
          {/* LOGO */}
          <div className="flex justify-start">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className="object-contain"
              priority
            />
          </div>
          {/* TEXTE */}
          <div className="text-center">
            <p className="text-red-600 text-xs tracking-widest uppercase mb-2">
              Le menu
            </p>
            <h1 className="font-serif text-5xl text-white tracking-widest">
              La Casita de la Paella
            </h1>
            <p className="text-amber-600 text-xs tracking-[0.4em] uppercase mt-2 font-light">
              Authentique · Artisanale · Alicante
            </p>
          </div>
          {/* PAELLA */}
          <div className="relative flex justify-end">
            <div className="relative w-40 h-40 shrink-0 pt-15">
              <Image
                src="/images/paella.png"
                alt="Paella"
                width={160}
                height={160}
                className="rounded-lg object-cover"
                priority
              />
              {steamParticles.map((p) => (
                <div
                  key={p.id}
                  className="absolute steam-particle"
                  style={{
                    left: `calc(50% + ${p.left - 40}px)`,
                    top: `${p.top}px`,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Menu triptyque (desktop) */}
      <div className="hidden md:block">
        <MenuTriptych categories={categories} />
      </div>

      {/* Footer */}
      <footer className="text-center bg-linear-to-r from-stone-950 to-stone-700 border-t-2 border-red-800 py-10">
        🔥 Tout cuit au feu de bois · Fait maison · Sur commande 🔥
      </footer>
    </>
  );
}
