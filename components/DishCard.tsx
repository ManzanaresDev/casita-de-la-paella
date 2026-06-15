// components/DishCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import SteamEffect from "./SteamEffect";
import type { DishWithRelations } from "@/types/menu";

interface Props {
  dish: DishWithRelations;
  featured?: boolean;
  animDelay?: number;
}

export default function DishCard({
  dish,
  featured = false,
  animDelay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), animDelay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animDelay]);

  if (featured) {
    return (
      <div
        ref={ref}
        className={`
          border border-red-900/30 rounded-xl p-4 mb-4
          bg-red-950/10 transition-all duration-700
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        <SteamEffect />
        <div className="text-3xl text-center mb-2">{dish.emoji}</div>
        <h3 className="font-serif text-lg text-white text-center mb-1">
          {dish.name}
        </h3>
        <p className="text-amber-500 text-lg font-bold text-center mb-3">
          {dish.price.toFixed(2)} €
        </p>
        <p className="text-stone-400 text-xs text-center leading-relaxed mb-3">
          {dish.description}
        </p>
        <div className="flex flex-wrap justify-center gap-1 mb-2">
          {dish.ingredients.map((i) => (
            <span
              key={i.id}
              className="text-[10px] border border-stone-700 text-stone-400 px-2 py-0.5 rounded-full"
            >
              {i.name}
            </span>
          ))}
        </div>
        {dish.allergens.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            <span className="text-[9px] text-stone-600 uppercase tracking-wide self-center">
              ⚠
            </span>
            {dish.allergens.map((a) => (
              <span
                key={a.id}
                className="text-[9px] bg-red-950/40 border border-red-800/30 text-red-400 px-2 py-0.5 rounded-full"
              >
                {a.name}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`
        mb-4 transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
      `}
    >
      <div className="flex justify-between items-baseline gap-2 mb-1">
        <span className="font-serif text-sm text-amber-100 font-bold">
          {dish.emoji} {dish.name}
        </span>
        <span className="text-red-500 text-sm font-bold whitespace-nowrap">
          {dish.price.toFixed(2)} €
        </span>
      </div>
      <p className="text-stone-500 text-xs leading-relaxed mb-2">
        {dish.description}
      </p>
      <div className="flex flex-wrap gap-1 mb-1">
        {dish.ingredients.map((i) => (
          <span
            key={i.id}
            className="text-[9px] border border-stone-800 text-stone-500 px-2 py-0.5 rounded-full"
          >
            {i.name}
          </span>
        ))}
      </div>
      {dish.allergens.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="text-[9px] text-stone-700 uppercase tracking-wide self-center">
            ⚠
          </span>
          {dish.allergens.map((a) => (
            <span
              key={a.id}
              className="text-[9px] bg-red-950/30 border border-red-900/30 text-red-500 px-2 py-0.5 rounded-full"
            >
              {a.name}
            </span>
          ))}
        </div>
      )}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent mt-4" />
    </div>
  );
}
