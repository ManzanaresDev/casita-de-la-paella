// components/MenuTriptych.tsx
import DishCard from "./DishCard";
import type { CategoryWithDishes } from "@/types/menu";

interface Props {
  categories: CategoryWithDishes[];
}

export default function MenuTriptych({ categories }: Props) {
  const [left, center, right] = categories;

  return (
    <div className="mx-auto my-10 w-full max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 rounded-xl bg-white/10 backdrop-blur-xs shadow-2xl overflow-x-auto">
        {/* Colonne gauche */}
        <div className="p-7 border-r border-white/20 min-w-0">
          <h2 className="font-serif text-xl text-white text-center mb-1">
            {left?.label}
          </h2>
          <div className="w-12 h-0.5 bg-red-700 mx-auto mb-6" />
          {left?.dishes.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} animDelay={i * 100} />
          ))}
        </div>

        {/* Colonne centre */}
        <div className="p-7 border-x border-white/10 bg-white/5 min-w-0">
          <h2 className="font-serif text-xl text-white text-center mb-1">
            {center?.label}
          </h2>
          <div className="w-12 h-0.5 bg-red-700 mx-auto mb-6" />
          {center?.dishes.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} animDelay={i * 150} />
          ))}
        </div>

        {/* Colonne droite */}
        <div className="p-7 border-l border-white/20 min-w-0">
          <h2 className="font-serif text-xl text-white text-center mb-1">
            {right?.label}
          </h2>
          <div className="w-12 h-0.5 bg-red-700 mx-auto mb-6" />
          {right?.dishes.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} animDelay={i * 100} />
          ))}
        </div>
      </div>
    </div>
  );
}
