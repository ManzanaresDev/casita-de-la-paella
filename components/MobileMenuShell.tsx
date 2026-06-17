// components/MenuTriptych.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { CategoryWithDishes, DishWithRelations } from "@/types/menu";

interface Props {
  categories: CategoryWithDishes[];
}

export default function MenuTriptych({ categories }: Props) {
  const [selectedDish, setSelectedDish] = useState<DishWithRelations | null>(
    null,
  );
  const [activeCategory, setActiveCategory] =
    useState<CategoryWithDishes | null>(null);

  const [left, center, right] = categories;

  const colBase = "p-7 min-w-0";
  const colVariants = [
    "border-r border-white/20",
    "border-x border-white/10 bg-white/5",
    "border-l border-white/20",
  ];

  const handleDishClick = (
    dish: DishWithRelations,
    cat: CategoryWithDishes,
  ) => {
    setSelectedDish(dish);
    setActiveCategory(cat);
  };

  return (
    <>
      <div className="mx-auto my-10 w-full max-w-6xl px-4">
        <div className="grid grid-cols-3 rounded-xl bg-white/10 backdrop-blur-xs shadow-2xl overflow-hidden">
          {[left, center, right].map((cat, idx) => (
            <div
              key={cat?.id ?? idx}
              className={`${colBase} ${colVariants[idx]}`}
            >
              <h2 className="font-serif text-xl text-white text-center mb-1">
                {cat?.label}
              </h2>
              <div className="w-12 h-0.5 bg-red-700 mx-auto mb-6" />
              {cat?.dishes.map((dish, i) => (
                <button
                  key={dish.id}
                  onClick={() => handleDishClick(dish, cat)}
                  className="w-full text-left pb-5 mb-5 border-b border-white/10 last:border-0 last:mb-0 last:pb-0 animate-fade-in group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-sm italic text-yellow-100 leading-snug flex-1 group-hover:text-amber-400 transition-colors">
                      {dish.name}
                    </h3>
                    <span className="bg-yellow-100 text-red-800 text-[11px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded-sm shrink-0">
                      {dish.price.toFixed(2)} €
                    </span>
                  </div>
                  {dish.description && (
                    <p className="text-white/60 text-[11px] mt-1.5 leading-relaxed font-sans line-clamp-2">
                      {dish.description}
                    </p>
                  )}
                  {(dish.ingredients?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {dish.ingredients.map((ing) => (
                        <span
                          key={ing.id}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-400"
                        >
                          {ing.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {(dish.allergens?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-amber-500 text-xs">⚠</span>
                      {dish.allergens.map((a) => (
                        <span
                          key={a.id}
                          className="text-amber-500 text-[10px] after:content-['·'] after:mx-1 last:after:content-['']"
                        >
                          {a.name}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL PLAT ── */}
      {selectedDish && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedDish(null)}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-6"
            onClick={() => setSelectedDish(null)}
          >
            <div
              className="relative w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[85vh]"
              style={{ backgroundColor: "#0c0a09" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
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
                  width={30}
                  height={30}
                  className="object-contain"
                  priority
                />
                <button
                  onClick={() => setSelectedDish(null)}
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
              <div className="flex-1 overflow-y-auto px-8 py-8">
                <h2
                  className="font-serif text-3xl leading-tight mb-2"
                  style={{ color: "#fafaf9" }}
                >
                  {selectedDish.name}
                </h2>

                {selectedDish.price != null && (
                  <p
                    className="text-2xl font-light mb-8"
                    style={{ color: "#d97706" }}
                  >
                    {Number(selectedDish.price).toFixed(2)} €
                  </p>
                )}

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

              {/* Footer */}
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
          </div>
        </>
      )}
    </>
  );
}
