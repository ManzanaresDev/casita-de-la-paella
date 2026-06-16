// components/DishCard.tsx
import type { DishWithRelations } from "@/types/menu";

interface Props {
  dish: DishWithRelations;
  animDelay?: number;
}

export default function DishCard({ dish, animDelay = 0 }: Props) {
  return (
    <div
      className="mb-6 pb-6 border-b border-white/10 last:border-0 last:mb-0 last:pb-0 animate-fade-in"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-l text-yellow-200 flex items-center gap-2">
          {dish.name}
        </h3>
        <span className="bg-yellow-200 text-red-700 font-semibold whitespace-nowrap p-1 rounded-sm">
          {dish.price.toFixed(2)} €
        </span>
      </div>

      {dish.description && (
        <p className="text-white text-xs mt-1">{dish.description}</p>
      )}

      {(dish.ingredients?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
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
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-amber-500 text-lg">⚠</span>
          {dish.allergens.map((a) => (
            <span
              key={a.id}
              className="text-amber-500 text-[10px] after:content-['•'] after:mx-1 last:after:content-['']"
            >
              {a.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
