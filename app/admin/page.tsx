// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, PlusCircle, EyeOff, Eye, X, Plus } from "lucide-react";
import type { DishWithRelations, CategoryWithDishes } from "@/types/menu";

// ─── Modal de modification ───────────────────────────────────────────────────

function EditModal({
  dish,
  categories,
  onClose,
  onSave,
}: {
  dish: DishWithRelations;
  categories: CategoryWithDishes[];
  onClose: () => void;
  onSave: (updated: DishWithRelations) => void;
}) {
  const [emoji, setEmoji] = useState(dish.emoji);
  const [price, setPrice] = useState(dish.price);
  const [categoryId, setCategoryId] = useState(dish.categoryId);
  const [ingredients, setIngredients] = useState(
    dish.ingredients.map((i) => i.name),
  );
  const [allergens, setAllergens] = useState(dish.allergens.map((a) => a.name));
  const [newIngredient, setNewIngredient] = useState("");
  const [newAllergen, setNewAllergen] = useState("");
  const [saving, setSaving] = useState(false);

  const addIngredient = () => {
    if (!newIngredient.trim()) return;
    setIngredients((prev) => [...prev, newIngredient.trim()]);
    setNewIngredient("");
  };

  const addAllergen = () => {
    if (!newAllergen.trim()) return;
    setAllergens((prev) => [...prev, newAllergen.trim()]);
    setNewAllergen("");
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = {
      ...dish,
      emoji,
      price,
      categoryId,
      ingredients: ingredients.map((name, i) => ({
        id: i,
        name,
        dishId: dish.id,
      })),
      allergens: allergens.map((name, i) => ({ id: i, name, dishId: dish.id })),
    };
    await fetch(`/api/dishes/${dish.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    onSave(updated);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-stone-900 border border-stone-700 rounded-xl w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <h2 className="text-white font-serif text-lg">
            Modifier — {dish.name}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Emoji + Prix */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-stone-400 mb-1">Emoji</label>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-center text-xl focus:outline-none focus:border-amber-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-stone-400 mb-1">
                Prix (€)
              </label>
              <input
                type="number"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs text-stone-400 mb-1">
              Catégorie
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value))}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-600"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ingrédients */}
          <div>
            <label className="block text-xs text-stone-400 mb-2">
              Ingrédients
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 bg-stone-800 border border-stone-700 text-stone-300 text-xs px-2 py-1 rounded-full"
                >
                  {ing}
                  <button
                    onClick={() =>
                      setIngredients((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="text-stone-500 hover:text-red-400 transition"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                placeholder="Ajouter un ingrédient..."
                className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-600"
              />
              <button
                onClick={addIngredient}
                className="p-2 bg-stone-800 border border-stone-700 rounded-lg text-amber-500 hover:border-amber-600 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Allergènes */}
          <div>
            <label className="block text-xs text-stone-400 mb-2">
              Allergènes
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {allergens.map((al, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 bg-red-950 border border-red-900 text-red-300 text-xs px-2 py-1 rounded-full"
                >
                  {al}
                  <button
                    onClick={() =>
                      setAllergens((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="text-red-500 hover:text-red-300 transition"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAllergen()}
                placeholder="Ajouter un allergène..."
                className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-600"
              />
              <button
                onClick={addAllergen}
                className="p-2 bg-stone-800 border border-stone-700 rounded-lg text-red-500 hover:border-red-600 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-stone-400 hover:text-white border border-stone-700 rounded-lg transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg transition font-medium"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [categories, setCategories] = useState<CategoryWithDishes[]>([]);
  const [editingDish, setEditingDish] = useState<DishWithRelations | null>(
    null,
  );

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

  const handleSave = (updated: DishWithRelations) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        dishes: cat.dishes.map((d) => (d.id === updated.id ? updated : d)),
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
                  <button
                    onClick={() => toggleAvailable(dish)}
                    title={dish.available ? "Masquer" : "Afficher"}
                    className="p-2 rounded border border-stone-700 hover:border-amber-600 text-stone-400 hover:text-amber-500 transition"
                  >
                    {dish.available ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => setEditingDish(dish)}
                    title="Modifier"
                    className="p-2 rounded border border-stone-700 hover:border-blue-600 text-stone-400 hover:text-blue-400 transition"
                  >
                    <Pencil size={16} />
                  </button>
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

      {/* Modal */}
      {editingDish && (
        <EditModal
          dish={editingDish}
          categories={categories}
          onClose={() => setEditingDish(null)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
