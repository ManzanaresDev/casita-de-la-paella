// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, PlusCircle, EyeOff, Eye } from "lucide-react";
import type { DishWithRelations, CategoryWithDishes } from "@/types/menu";

export default function AdminPage() {
  const [categories, setCategories] = useState<CategoryWithDishes[]>([]);

  useEffect(() => {
    fetch("/api/dishes")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const toggleAvailable = async (dish: DishWithRelations) => {
    await fetch(`/api/dishes/${dish.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dish, available: !dish.available }),
    });
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        dishes: cat.dishes.map((d) =>
          d.id === dish.id ? { ...d, available: !d.available } : d,
        ),
      })),
    );
  };

  const deleteDish = async (id: number) => {
    if (!confirm("Supprimer ce plat ?")) return;
    await fetch(`/api/dishes/${id}`, { method: "DELETE" });
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        dishes: cat.dishes.filter((d) => d.id !== id),
      })),
    );
  };

  return (
    <main className="min-h-screen bg-stone-950 text-stone-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-white">
          🔧 Administration du menu
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition text-sm font-medium">
          <PlusCircle size={18} />
          Ajouter un plat
        </button>
      </div>

      {categories.map((cat) => (
        <section key={cat.id} className="mb-10">
          <h2 className="text-lg text-amber-500 font-bold mb-4 border-b border-stone-800 pb-2">
            {cat.label}
          </h2>
          <div className="space-y-3">
            {cat.dishes.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center justify-between bg-stone-900 border border-stone-800 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span>{dish.emoji}</span>
                  <span className="font-medium text-white">{dish.name}</span>
                  <span className="text-amber-500 text-sm">{dish.price} €</span>
                  {!dish.available && (
                    <span className="text-xs text-red-500 italic">masqué</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {/* Masquer / Afficher */}
                  <button
                    onClick={() => toggleAvailable(dish)}
                    title={dish.available ? "Masquer" : "Afficher"}
                    className="p-2 rounded border border-stone-700 hover:border-amber-600 text-stone-400 hover:text-amber-500 transition"
                  >
                    {dish.available ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>

                  {/* Modifier */}
                  <button
                    title="Modifier"
                    className="p-2 rounded border border-stone-700 hover:border-blue-600 text-stone-400 hover:text-blue-400 transition"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* Supprimer */}
                  <button
                    onClick={() => deleteDish(dish.id)}
                    title="Supprimer"
                    className="p-2 rounded border border-red-900 text-red-500 hover:bg-red-950 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
