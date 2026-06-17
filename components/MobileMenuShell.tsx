"use client";

import { useState } from "react";
import Image from "next/image";
import type { CategoryWithDishes, DishWithRelations } from "@/types/menu";

interface Props {
  categories: CategoryWithDishes[];
  steamParticles: { id: number; left: number; top: number; delay: number }[];
}

export default function MobileMenuShell({ categories, steamParticles }: Props) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<CategoryWithDishes | null>(null);
  const [selectedDish, setSelectedDish] = useState<DishWithRelations | null>(
    null,
  );

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

      {/* ── DRAWER OVERLAY ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── DRAWER ── */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-stone-950 border-r-2 border-red-800 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <span className="text-amber-600 text-xs tracking-[0.3em] uppercase font-light">
            La Carte
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="text-stone-400 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
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

      {/* ── LISTE DE PLATS ── */}
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
                <path
                  d="M3 3l12 12M15 3L3 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <ul className="divide-y divide-stone-100">
            {activeCategory.dishes.map((dish) => (
              <li key={dish.id}>
                <button
                  onClick={() => setSelectedDish(dish)}
                  className="w-full text-left px-4 py-4 active:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-base text-stone-900 leading-snug">
                      {dish.name}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {dish.price != null && (
                        <span className="text-sm font-medium text-amber-700">
                          {Number(dish.price).toFixed(2)} €
                        </span>
                      )}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        style={{ color: "#a8a29e" }}
                      >
                        <path
                          d="M5 3l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {dish.description && (
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {dish.description}
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── MODAL PLAT ── */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-60 flex flex-col"
          style={{ backgroundColor: "#0c0a09" }}
        >
          {/* Header modal */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b shrink-0"
            style={{ borderColor: "#7f1d1d" }}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase font-light"
              style={{ color: "#d97706" }}
            >
              {activeCategory?.label}
            </span>
            <Image
              src="/images/spain.png"
              alt="Logo"
              width={30}
              height={30}
              className="object-contain"
              priority
            />
            <button
              onClick={() => setSelectedDish(null)}
              aria-label="Fermer"
              style={{ color: "#78716c" }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M4 4l14 14M18 4L4 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            {/* Nom du plat */}
            <h2
              className="font-serif text-3xl leading-tight mb-2"
              style={{ color: "#fafaf9" }}
            >
              {selectedDish.name}
            </h2>

            {/* Prix */}
            {selectedDish.price != null && (
              <p
                className="text-2xl font-light mb-8"
                style={{ color: "#d97706" }}
              >
                {Number(selectedDish.price).toFixed(2)} €
              </p>
            )}

            {/* Séparateur décoratif */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "#7f1d1d" }}
              />
              <span style={{ color: "#7f1d1d", fontSize: 18 }}>✦</span>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "#7f1d1d" }}
              />
            </div>

            {/* Description */}
            {selectedDish.description && (
              <div className="mb-8">
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#a8a29e" }}
                >
                  {selectedDish.description}
                </p>
              </div>
            )}

            {/* Ingrédients */}
            {selectedDish.ingredients?.length > 0 && (
              <div className="mb-8">
                <h3
                  className="text-xs tracking-[0.25em] uppercase mb-3"
                  style={{ color: "#d97706" }}
                >
                  Ingrédients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDish.ingredients.map((ing) => (
                    <span
                      key={ing.id}
                      className="text-sm px-3 py-1 rounded-full border"
                      style={{
                        color: "#d6d3d1",
                        borderColor: "#44403c",
                        backgroundColor: "#1c1917",
                      }}
                    >
                      {ing.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergènes */}
            {selectedDish.allergens?.length > 0 && (
              <div className="mb-8">
                <h3
                  className="text-xs tracking-[0.25em] uppercase mb-3"
                  style={{ color: "#b91c1c" }}
                >
                  Allergènes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDish.allergens.map((al) => (
                    <span
                      key={al.id}
                      className="text-sm px-3 py-1 rounded-full border"
                      style={{
                        color: "#fca5a5",
                        borderColor: "#7f1d1d",
                        backgroundColor: "#450a0a",
                      }}
                    >
                      {al.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer modal */}
          <div
            className="px-6 py-5 border-t shrink-0"
            style={{ borderColor: "#292524" }}
          >
            <p
              className="text-center text-xs tracking-widest uppercase"
              style={{ color: "#57534e" }}
            >
              🔥 Fait maison · Cuit au feu de bois
            </p>
          </div>
        </div>
      )}
    </>
  );
}
