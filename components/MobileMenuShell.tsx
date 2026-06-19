// components/MobileMenuShell.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { CategoryWithDishes, DishWithRelations } from "@/types/menu";
import DishImageCarousel from "./DishImageCarousel";

interface SteamParticle {
  id: number;
  left: number;
  top: number;
  delay: number;
}

interface Props {
  categories: CategoryWithDishes[];
  steamParticles: SteamParticle[];
}

export default function MobileMenuShell({ categories, steamParticles }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
    categories[0]?.id ?? null,
  );
  const [selectedDish, setSelectedDish] = useState<DishWithRelations | null>(
    null,
  );
  const [activeCategory, setActiveCategory] =
    useState<CategoryWithDishes | null>(null);

  const currentCategory =
    categories.find((c) => c.id === activeCategoryId) ?? categories[0];

  const handleDishClick = (
    dish: DishWithRelations,
    cat: CategoryWithDishes,
  ) => {
    setSelectedDish(dish);
    setActiveCategory(cat);
  };

  const closeModal = () => {
    setSelectedDish(null);
    setActiveCategory(null);
  };

  const handleCategorySelect = (id: number) => {
    setActiveCategoryId(id);
    setDrawerOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-stone-950 to-stone-900">
      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-red-900/40">
        {/* Burger */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex flex-col gap-1.5 p-2"
        >
          <span className="block w-6 h-0.5 bg-stone-300" />
          <span className="block w-6 h-0.5 bg-stone-300" />
          <span className="block w-6 h-0.5 bg-stone-300" />
        </button>

        {/* nom + Logo */}
        <div className="flex items-center gap-2">
          <div className="text-left">
            <h1 className="font-serif text-white text-sm leading-tight">
              La Casita de la Paella
            </h1>
            <p className="text-red-600 text-[10px] tracking-widest uppercase leading-none mb-0.5">
              Le menu
            </p>
          </div>
        </div>

        {/* logo */}
        <Image
          src="/images/logo.png"
          alt="Espagne"
          width={60}
          height={60}
          className="object-contain"
        />
      </header>

      {/* ── TITRE CATÉGORIE ACTIVE ── */}
      <div className="px-5 pt-6 pb-2">
        <h2 className="font-serif text-2xl text-white">
          {currentCategory?.label}
        </h2>
        <div className="w-10 h-0.5 bg-red-700 mt-2" />
      </div>

      {/* ── LISTE DES PLATS ── */}
      <main className="px-5 py-4 space-y-0">
        {currentCategory?.dishes.map((dish, i) => (
          <button
            key={dish.id}
            onClick={() => handleDishClick(dish, currentCategory)}
            className="w-full text-left pb-5 mb-5 border-b border-white/10 last:border-0 last:mb-0 last:pb-0 group"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-base italic text-yellow-100 leading-snug flex-1 group-hover:text-amber-400 transition-colors">
                {dish.name}
              </h3>
              <span className="bg-yellow-100 text-red-800 text-[11px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded-sm shrink-0">
                {dish.price.toFixed(2)} €
              </span>
            </div>
            {dish.description && (
              <p className="text-white/60 text-xs mt-1.5 leading-relaxed line-clamp-2">
                {dish.description}
              </p>
            )}
            {(dish.allergens?.length ?? 0) > 0 && (
              <span className="inline-block mt-2 text-amber-500 text-[10px]">
                ⚠ allergènes
              </span>
            )}
          </button>
        ))}
      </main>

      {/* ── DRAWER LATÉRAL ── */}
      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Panneau */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col
          bg-stone-950 border-r border-red-900/40 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* En-tête drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-900/40">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="font-serif text-white text-sm leading-tight">
              La Casita
              <br />
              de la Paella
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Fermer"
            className="text-stone-400 hover:text-white transition-colors p-1"
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

        {/* Catégories */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="text-amber-600 text-[10px] tracking-[0.3em] uppercase mb-4 px-2">
            Nos catégories
          </p>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-serif text-base transition-colors
                ${
                  activeCategoryId === cat.id
                    ? "bg-red-900/40 text-amber-400 border border-red-800/60"
                    : "text-stone-300 hover:bg-white/5 hover:text-white"
                }`}
            >
              {cat.label}
              <span className="ml-2 text-xs text-stone-500">
                ({cat.dishes.length})
              </span>
            </button>
          ))}
        </nav>

        {/* Footer drawer */}
        <div className="px-5 py-4 border-t border-stone-800">
          <p className="text-stone-600 text-[10px] tracking-widest uppercase text-center">
            Cuisine espagnole · Fait maison
          </p>
        </div>
      </div>

      {/* ── MODAL PLAT ── */}
      {selectedDish && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div
            className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-6"
            onClick={closeModal}
          >
            <div
              className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
              style={{ backgroundColor: "#0c0a09" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header modal */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b shrink-0"
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
                  width={28}
                  height={28}
                  className="object-contain"
                />
                <button
                  onClick={closeModal}
                  aria-label="Fermer"
                  style={{ color: "#78716c" }}
                  className="hover:text-white transition-colors"
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
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {selectedDish.images?.length > 0 && (
                  <DishImageCarousel
                    images={selectedDish.images}
                    alt={selectedDish.name}
                  />
                )}

                <h2
                  className="font-serif text-3xl leading-tight mb-2"
                  style={{ color: "#fafaf9" }}
                >
                  {selectedDish.name}
                </h2>
                {selectedDish.price != null && (
                  <p
                    className="text-2xl font-light mb-6"
                    style={{ color: "#d97706" }}
                  >
                    {Number(selectedDish.price).toFixed(2)} €
                  </p>
                )}
                <div className="flex items-center gap-3 mb-6">
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
                {selectedDish.description && (
                  <p
                    className="text-base leading-relaxed mb-6"
                    style={{ color: "#a8a29e" }}
                  >
                    {selectedDish.description}
                  </p>
                )}
                {selectedDish.ingredients?.length > 0 && (
                  <div className="mb-6">
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
                {selectedDish.allergens?.length > 0 && (
                  <div className="mb-6">
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
                className="px-6 py-4 border-t shrink-0"
                style={{ borderColor: "#292524" }}
              >
                <p
                  className="text-center text-xs tracking-widest uppercase"
                  style={{ color: "#57534e" }}
                >
                  Cuisine espagnole · Fait maison
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
