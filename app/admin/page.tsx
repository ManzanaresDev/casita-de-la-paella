// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { CategoryWithDishes, DishWithRelations } from "@/types/menu";

export default function AdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithDishes[]>([]);
  const [dishes, setDishes] = useState<DishWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/dishes")
      .then((r) => r.json())
      .then((data: CategoryWithDishes[]) => {
        setCategories(data);
        setDishes(data.flatMap((cat) => cat.dishes));
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce plat ?")) return;
    setDeletingId(id);
    await fetch(`/api/dishes/${id}`, { method: "DELETE" });
    setDishes((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
  };

  const dishesByCategory = categories.map((cat) => ({
    ...cat,
    dishes: dishes.filter((d) => d.categoryId === cat.id),
  }));

  return (
    <main className="min-h-screen bg-stone-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif text-amber-400">Administration</h1>
          <button
            onClick={() => router.push("/admin/dishes/new")}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition text-sm font-medium"
          >
            <Plus size={16} />
            Nouveau plat
          </button>
        </div>

        {loading ? (
          <p className="text-stone-500 text-sm">Chargement...</p>
        ) : dishes.length === 0 ? (
          <p className="text-stone-500 text-sm">Aucun plat. Ajoutez-en un !</p>
        ) : (
          <div className="space-y-8">
            {dishesByCategory.map((cat) =>
              cat.dishes.length === 0 ? null : (
                <section key={cat.id}>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">
                    {cat.label}
                  </h2>
                  <div className="space-y-2">
                    {cat.dishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="flex items-center gap-4 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 hover:border-stone-700 transition group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {dish.name}
                          </p>
                          {dish.description && (
                            <p className="text-stone-500 text-xs truncate">
                              {dish.description}
                            </p>
                          )}
                          {dish.ingredients.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {dish.ingredients.map((ing) => (
                                <span
                                  key={ing.id}
                                  className="text-xs text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded"
                                >
                                  {ing.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <span className="text-amber-400 font-medium text-sm shrink-0">
                          {dish.price.toFixed(2)} €
                        </span>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                          <button
                            onClick={() =>
                              router.push(`/admin/dishes/${dish.id}/edit`)
                            }
                            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition"
                            title="Modifier"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(dish.id)}
                            disabled={deletingId === dish.id}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}
