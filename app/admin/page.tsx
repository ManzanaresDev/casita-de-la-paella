"use client";

import { useState, useEffect } from "react";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import type { CategoryWithDishes, DishWithRelations } from "@/types/menu";

// ─── Modal d'ajout ───────────────────────────────────────────────────────────

function DishForm({
  categories,
  initial,
  onClose,
  onSave,
  mode,
}: {
  categories: CategoryWithDishes[];
  initial?: DishWithRelations;
  onClose: () => void;
  onSave: (dish: DishWithRelations) => void;
  mode: "add" | "edit";
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "🥘");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? 1
  );
  const [ingredients, setIngredients] = useState<string[]>(
    initial?.ingredients.map((i) => i.name) ?? []
  );
  const [allergens, setAllergens] = useState<string[]>(
    initial?.allergens.map((a) => a.name) ?? []
  );
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
    if (!name.trim()) return;
    setSaving(true);

    const isEdit = mode === "edit" && initial;
    const url = isEdit ? `/api/dishes/${initial.id}` : "/api/dishes";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        emoji,
        price,
        categoryId,
        ingredients,
        allergens,
      }),
    });
    const dish = await res.json();
    onSave(dish);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-stone-900 border border-stone-700 rounded-xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 sticky top-0 bg-stone-900">
          <h2 className="text-white font-serif text-lg">
            {mode === "add" ? "✨ Nouveau plat" : "✏️ Modifier le plat"}
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
          <div>
            <label className="block text-xs text-stone-400 mb-1">
              Nom du plat *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Paëlla Valenciana"
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="La recette originale de Valence..."
              rows={2}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:border-amber-600 resize-none"
            />
          </div>

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
                min="0"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

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
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-800 sticky bottom-0 bg-stone-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-stone-400 hover:text-white border border-stone-700 rounded-lg transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg transition font-medium"
          >
            {saving
              ? "Enregistrement..."
              : mode === "add"
              ? "Ajouter le plat"
              : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page admin ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [categories, setCategories] = useState<CategoryWithDishes[]>([]);
  const [dishes, setDishes] = useState<DishWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editDish, setEditDish] = useState<DishWithRelations | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Chargement initial
  useEffect(() => {
    fetch("/api/dishes")
      .then((r) => r.json())
      .then((data: CategoryWithDishes[]) => {
        setCategories(data);
        setDishes(data.flatMap((cat) => cat.dishes));
        setLoading(false);
      });
  }, []);

  const handleAdd = (dish: DishWithRelations) => {
    setDishes((prev) => [...prev, dish]);
  };

  const handleEdit = (updated: DishWithRelations) => {
    setDishes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce plat ?")) return;
    setDeletingId(id);
    await fetch(`/api/dishes/${id}`, { method: "DELETE" });
    setDishes((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
  };

  // Regrouper par catégorie pour l'affichage
  const dishesByCategory = categories.map((cat) => ({
    ...cat,
    dishes: dishes.filter((d) => d.categoryId === cat.id),
  }));

  return (
    <main className="min-h-screen bg-stone-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif text-amber-400">Administration</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition text-sm font-medium"
          >
            <Plus size={16} />
            Nouveau plat
          </button>
        </div>

        {/* Contenu */}
        {loading ? (
          <p className="text-stone-500 text-sm">Chargement...</p>
        ) : dishes.length === 0 ? (
          <p className="text-stone-500 text-sm">
            Aucun plat. Ajoutez-en un !
          </p>
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
                        {/* Emoji */}
                        <span className="text-2xl w-8 text-center shrink-0">
                          {dish.emoji}
                        </span>

                        {/* Infos */}
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

                        {/* Prix */}
                        <span className="text-amber-400 font-medium text-sm shrink-0">
                          {dish.price.toFixed(2)} €
                        </span>

                        {/* Actions */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                          <button
                            onClick={() => setEditDish(dish)}
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
              )
            )}
          </div>
        )}
      </div>

      {/* Modal ajout */}
      {showAdd && (
        <DishForm
          mode="add"
          categories={categories}
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
        />
      )}

      {/* Modal édition */}
      {editDish && (
        <DishForm
          mode="edit"
          categories={categories}
          initial={editDish}
          onClose={() => setEditDish(null)}
          onSave={handleEdit}
        />
      )}
    </main>
  );
}
