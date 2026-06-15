// components/MenuTriptych.tsx
import DishCard from "./DishCard";
import type { CategoryWithDishes } from "@/types/menu";

interface Props {
  categories: CategoryWithDishes[];
}

export default function MenuTriptych({ categories }: Props) {
  const [left, center, right] = categories;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-5xl mx-auto">
      {/* Colonne gauche */}
      <div className="bg-stone-950 p-7 border-r border-stone-900">
        <h2 className="font-serif text-xl text-white text-center mb-1">
          {left?.label}
        </h2>
        <div className="w-12 h-0.5 bg-red-700 mx-auto mb-6" />
        {left?.dishes.map((dish, i) => (
          <DishCard key={dish.id} dish={dish} animDelay={i * 100} />
        ))}
      </div>

      {/* Colonne centre — spécialités */}
      <div className="bg-stone-900 p-7 border-x-2 border-red-800">
        <h2 className="font-serif text-xl text-white text-center mb-1">
          {center?.label}
        </h2>
        <div className="w-12 h-0.5 bg-red-700 mx-auto mb-6" />
        {center?.dishes.map((dish, i) => (
          <DishCard key={dish.id} dish={dish} featured animDelay={i * 150} />
        ))}
      </div>

      {/* Colonne droite */}
      <div className="bg-stone-950 p-7 border-l border-stone-900">
        <h2 className="font-serif text-xl text-white text-center mb-1">
          {right?.label}
        </h2>
        <div className="w-12 h-0.5 bg-red-700 mx-auto mb-6" />
        {right?.dishes.map((dish, i) => (
          <DishCard key={dish.id} dish={dish} animDelay={i * 100} />
        ))}
      </div>
    </div>
  );
}
