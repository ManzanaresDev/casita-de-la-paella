// app/page.tsx
import Image from "next/image";
import { db } from "@/app/db";
import MenuTriptych from "@/components/MenuTriptych";
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
      {/* HEADER */}
      <header className="bg-linear-to-r from-stone-950 to-stone-700 border-b-2 text-stone-200 border-red-800 py-3 ">
        {/* mobile */}
        <div className="relative md:hidden overflow-hidden py-4 px-4 min-h-30">
          {/* HEADER LEFT */}
          <div className="flex items-center gap-3 relative z-10">
            {/* <Image
              src="/images/logo.png"
              alt="Logo"
              width={45}
              height={45}
              className="object-contain shrink-0"
              priority
            /> */}

            <div>
              <h1 className="font-serif text-3xl text-white leading-tight">
                La Casita de la Paella
              </h1>

              <p className="text-amber-600 text-[10px] tracking-[0.3em] uppercase mt-1">
                Authentique · Artisanale · Alicante
              </p>
            </div>
          </div>

          {/* PAELLA */}
          <div className="absolute right-0 top-1/2 translate-y-1 translate-x-2 z-0">
            <div className="relative w-44 h-44">
              <Image
                src="/images/paella.png"
                alt="Paella"
                width={160}
                height={160}
                className="object-contain"
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

        {/* desktop */}
        <div className="hidden md:grid max-w-6xl mx-auto grid-cols-3 items-center px-6">
          {/* LOGO (gauche) */}
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
          {/* TEXTE (centre) */}
          <div className="text-center">
            <p className="hidden md:block text-red-600 text-xs tracking-widest uppercase mb-2">
              Le menu
            </p>
            <h1 className="font-serif text-5xl text-white tracking-widest">
              La Casita de la Paella
            </h1>
            <p className="text-amber-600 text-xs tracking-[0.4em] uppercase mt-2 font-light">
              Authentique · Artisanale · Aicante
            </p>
          </div>
          {/* IMAGE PAELLA + VAPEUR (droite) */}
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
      {/* Menu triptyque */}
      <MenuTriptych categories={categories} />
      {/* Footer */}
      <footer className="text-center bg-linear-to-r from-stone-950 to-stone-700 border-t-2 border-red-800 py-10">
        🔥 Tout cuit au feu de bois · Fait maison · Sur commande 🔥
      </footer>
    </>
  );
}
