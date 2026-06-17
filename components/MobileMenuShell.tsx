"use client";

import { useState } from "react";
import Image from "next/image";
import type { CategoryWithDishes } from "@/types/menu";

interface Props {
  categories: CategoryWithDishes[];
  steamParticles: { id: number; left: number; top: number; delay: number }[];
}

export default function MobileMenuShell({ categories, steamParticles }: Props) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryWithDishes | null>(null);

  const handleCategoryClick = (cat: CategoryWithDishes) => {
    setActiveCategory(cat);
    setOpen(false);
  };

  return (
    <>
      {/* ── HEADER MOBILE ── */}
      <div className="relative overflow-hidden py-4 px-4 min-h-30">
        <div className="flex flex-col relative z-10">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-serif text-3xl text-white leading-tight">
                La Casita de la Paella
              </h1>
              <p className="text-amber-600 text-[10px] tracking-[0.3em] uppercase mt-1">
                Authentique · Artisanale · Alicante
              </p>
            </div>
          </div>

          {/* Burger button */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            className="mt-3 flex items-center gap-2 text-amber-500 text-xs tracking-widest uppercase w-fit"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block w-5 h-[2px] bg-amber-500 rounded" />
              <span className="block w-5 h-[2px] bg-amber-500 rounded" />
              <span className="block w-5 h-[2px] bg-amber-500 rounded" />
            </span>
            <span>Carte</span>
          </button>
        </div>

        {/* Paella image */}
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

      {/* ── DRAWER ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-stone-950 border-r-2 border-red-800 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <span className="text-amber-600 text-xs tracking-[0.3em] uppercase font-light">
            La Carte
          </span>
                  <Image
                    src="/images/spain.png"
                    alt="drapeau Espagne"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="text-stone-400 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col py-4">
          {categories.map((cat) => {
            const isActive = activeCategory?.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="text-left px-6 py-4 text-base font-serif tracking-wide transition-colors border-l-2"
                style={{
                  color: isActive ? "#fbbf24" : "#d6d3d1",
                  borderLeftColor: isActive ? "#f59e0b" : "transparent",
                  backgroundColor: isActive ? "#1c1917" : "transparent",
                }}
              >
                {cat.label}
                <span
                  className="block text-xs font-sans tracking-normal mt-0.5"
                  style={{ color: "#78716c" }}
                >
                  {cat.dishes.length} plat{cat.dishes.length > 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── LISTE DE PLATS dans le flux principal ── */}
      {activeCategory && (
        <div className="mx-3 mt-4 mb-2 rounded-xl bg-white/85 backdrop-blur-sm shadow-lg border border-stone-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
            <h2 className="font-serif text-lg text-stone-800 tracking-wide">
              {activeCategory.label}
            </h2>
            <button
              onClick={() => setActiveCategory(null)}
              aria-label="Fermer"
              className="text-stone-400 hover:text-stone-700 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <ul className="divide-y divide-stone-100">
            {activeCategory.dishes.map((dish) => (
              <li key={dish.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-serif text-base text-stone-900 leading-snug">
                    {dish.name}
                  </h3>
                  {dish.price != null && (
                    <span className="shrink-0 text-sm font-medium text-amber-700">
                      {Number(dish.price).toFixed(2)} €
                    </span>
                  )}
                </div>

                {dish.description && (
                  <p className="text-sm text-stone-600 leading-relaxed mb-2">
                    {dish.description}
                  </p>
                )}

                {dish.ingredients?.length > 0 && (
                  <p className="text-xs text-stone-500 mb-1">
                    <span className="font-medium text-stone-600">Ingrédients : </span>
                    {dish.ingredients.map((i: { name: string }) => i.name).join(", ")}
                  </p>
                )}

                {dish.allergens?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {dish.allergens.map((a: { name: string }) => (
                      <span
                        key={a.name}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 tracking-wide"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
