// components/DishForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { DishWithRelations } from "@/types/menu";
import ComboboxTag from "./ComboboxTag";
import MultiImageUploader, { DishImage } from "@/components/MultiImageUploader";

interface CategoryOption {
  id: number;
  label: string;
}
interface Props {
  categories: CategoryOption[];
  initial?: DishWithRelations;
  mode: "add" | "edit";
  existingIngredients: string[];
  existingAllergens: string[];
}

export default function DishForm({
  categories,
  initial,
  mode,
  existingIngredients,
  existingAllergens,
}: Props) {
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? 1,
  );
  const [ingredients, setIngredients] = useState<string[]>(
    initial?.ingredients.map((i) => i.name) ?? [],
  );
  const [allergens, setAllergens] = useState<string[]>(
    initial?.allergens.map((a) => a.name) ?? [],
  );
  const [saving, setSaving] = useState(false);

  const [images, setImages] = useState<DishImage[]>(
    initial?.images?.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    })) ?? [],
  );

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    const isEdit = mode === "edit" && initial;
    const url = isEdit ? `/api/dishes/${initial.id}` : "/api/dishes";
    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price,
        categoryId,
        ingredients,
        allergens,
        images,
      }),
    });

    setSaving(false);
    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-stone-950 text-white p-8">
      <div className="max-w-lg mx-auto bg-stone-900 border border-stone-700 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <h2 className="text-white font-serif text-lg">
            {mode === "add" ? "✨ Nouveau plat" : "✏️ Modifier le plat"}
          </h2>
          <button
            onClick={() => router.push("/admin")}
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
          <MultiImageUploader images={images} onChange={setImages} />

          <div>
            {/* Ingrédients */}
            <ComboboxTag
              label="Ingrédients"
              values={ingredients}
              suggestions={existingIngredients}
              onChange={setIngredients}
              accentColor="amber"
            />
            {/* Allergènes */}
            <ComboboxTag
              label="Allergènes"
              values={allergens}
              suggestions={existingAllergens}
              onChange={setAllergens}
              accentColor="red"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-800">
          <button
            onClick={() => router.push("/admin")}
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
    </main>
  );
}
