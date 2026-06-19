# Tutoriel — Upload de plusieurs images par plat (Cloudinary)

Ce tutoriel couvre toutes les modifications nécessaires pour permettre d'uploader **plusieurs images** par plat, depuis le formulaire d'édition/ajout, avec upload direct côté client vers Cloudinary (upload signé).

## Vue d'ensemble

| Étape | Fichier | Action |
|---|---|---|
| 1 | `app/db/schema.ts` | Ajouter la table `dish_images` |
| 2 | Terminal | Générer et appliquer la migration |
| 3 | `.env.local` | Ajouter les clés Cloudinary |
| 4 | `app/api/sign-upload/route.ts` | Créer la route de signature |
| 5 | `components/MultiImageUploader.tsx` | Créer le composant d'upload |
| 6 | `components/DishForm.tsx` | Intégrer l'uploader |
| 7 | `types/menu.ts` | Mettre à jour `DishWithRelations` |
| 8 | `app/admin/dishes/[id]/edit/page.tsx` | Charger les images existantes |
| 9 | `app/api/dishes/route.ts` et `app/api/dishes/[id]/route.ts` | Sauvegarder les images |

---

## 1. Schema Drizzle — table `dish_images`

Une seule image par plat ne suffit plus : on crée une table séparée, liée à `dishes` par une relation **one-to-many**.

Dans `app/db/schema.ts`, ajoute :

```ts
import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const dishImages = pgTable("dish_images", {
  id: serial("id").primaryKey(),
  dishId: integer("dish_id")
    .notNull()
    .references(() => dishes.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  publicId: text("public_id").notNull(), // identifiant Cloudinary, utile pour la suppression
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dishImagesRelations = relations(dishImages, ({ one }) => ({
  dish: one(dishes, {
    fields: [dishImages.dishId],
    references: [dishes.id],
  }),
}));
```

Puis modifie la relation existante de `dishes` pour y ajouter `images` :

```ts
export const dishesRelations = relations(dishes, ({ many }) => ({
  ingredients: many(ingredients),
  allergens: many(allergens),
  images: many(dishImages), // ← ajout
}));
```

> Adapte `pgTable` selon ta base (`mysqlTable`, `sqliteTable`...) si tu n'es pas sur Postgres.

---

## 2. Migration

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Vérifie que la table `dish_images` apparaît bien dans ta base après coup.

---

## 3. Variables d'environnement

Dans `.env.local` (à la racine du projet, jamais commit) :

```
CLOUDINARY_CLOUD_NAME=ton_cloud_name
CLOUDINARY_API_KEY=ta_api_key
CLOUDINARY_API_SECRET=ton_api_secret
```

Ces 3 valeurs sont disponibles sur ton dashboard Cloudinary.

Installe le SDK :

```bash
npm install cloudinary
```

---

## 4. Route de signature — `app/api/sign-upload/route.ts`

Cette route ne fait que générer une signature ; le fichier ne transite jamais par ton serveur.

```ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "dishes" },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return Response.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
```

---

## 5. Composant `components/MultiImageUploader.tsx`

Gère la sélection multiple, l'upload direct vers Cloudinary, l'aperçu en grille, et la suppression locale avant sauvegarde.

```tsx
"use client";

import { useState } from "react";
import { X, Loader2, ImagePlus } from "lucide-react";

export interface DishImage {
  url: string;
  publicId: string;
}

interface Props {
  images: DishImage[];
  onChange: (images: DishImage[]) => void;
  maxImages?: number;
}

export default function MultiImageUploader({
  images,
  onChange,
  maxImages = 6,
}: Props) {
  const [uploadingCount, setUploadingCount] = useState(0);

  async function uploadOne(file: File): Promise<DishImage> {
    const { timestamp, signature, apiKey, cloudName } = await fetch(
      "/api/sign-upload",
      { method: "POST" },
    ).then((r) => r.json());

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", "dishes");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!res.ok) {
      throw new Error("Échec de l'upload vers Cloudinary");
    }

    const data = await res.json();
    return { url: data.secure_url, publicId: data.public_id };
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).slice(
      0,
      Math.max(0, maxImages - images.length),
    );
    if (files.length === 0) return;

    setUploadingCount(files.length);

    try {
      const uploaded = await Promise.all(files.map(uploadOne));
      onChange([...images, ...uploaded]);
    } catch (err) {
      console.error(err);
      alert("Une ou plusieurs images n'ont pas pu être uploadées.");
    } finally {
      setUploadingCount(0);
    }
  }

  function removeImage(publicId: string) {
    onChange(images.filter((img) => img.publicId !== publicId));
  }

  const canAddMore = images.length < maxImages;

  return (
    <div>
      <label className="block text-xs text-stone-400 mb-2">
        Images du plat ({images.length}/{maxImages})
      </label>

      <div className="grid grid-cols-3 gap-3">
        {images.map((img) => (
          <div
            key={img.publicId}
            className="relative aspect-square rounded-lg overflow-hidden border border-stone-700 group"
          >
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(img.publicId)}
              className="absolute top-1 right-1 bg-stone-950/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              aria-label="Supprimer l'image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {Array.from({ length: uploadingCount }).map((_, i) => (
          <div
            key={`uploading-${i}`}
            className="aspect-square rounded-lg border border-dashed border-stone-700 flex items-center justify-center bg-stone-800"
          >
            <Loader2 size={20} className="animate-spin text-amber-500" />
          </div>
        ))}

        {canAddMore && uploadingCount === 0 && (
          <label className="aspect-square rounded-lg border border-dashed border-stone-700 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-amber-600 transition text-stone-400 hover:text-amber-500">
            <ImagePlus size={20} />
            <span className="text-[10px]">Ajouter</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
```

---

## 6. Intégration dans `components/DishForm.tsx`

Trois changements dans le fichier existant :

**a) Import du composant**

```tsx
import MultiImageUploader, { DishImage } from "./MultiImageUploader";
```

**b) Nouvel état, pré-rempli en mode édition**

```tsx
const [images, setImages] = useState<DishImage[]>(
  initial?.images?.map((img) => ({
    url: img.url,
    publicId: img.publicId,
  })) ?? [],
);
```

**c) Inclure `images` dans le payload envoyé à l'API**

```tsx
body: JSON.stringify({
  name,
  description,
  price,
  categoryId,
  ingredients,
  allergens,
  images, // ← ajout
}),
```

**d) Afficher le composant dans le JSX**, juste avant le bloc Ingrédients/Allergènes par exemple :

```tsx
<MultiImageUploader images={images} onChange={setImages} />
```

---

## 7. Mise à jour du type `DishWithRelations`

Dans `types/menu.ts`, ajoute le champ `images` :

```ts
export type DishWithRelations = Dish & {
  ingredients: Ingredient[];
  allergens: Allergen[];
  images: { url: string; publicId: string }[]; // ← ajout
};
```

---

## 8. Charger les images existantes — `app/admin/dishes/[id]/edit/page.tsx`

Ajoute `images: true` à la requête Drizzle pour que `dish.images` soit bien rempli :

```ts
db.query.dishes.findFirst({
  where: eq(dishes.id, dishId),
  with: { ingredients: true, allergens: true, images: true }, // ← ajout
}),
```

---

## 9. Sauvegarder les images côté API

Dans tes routes `app/api/dishes/route.ts` (POST) et `app/api/dishes/[id]/route.ts` (PUT), il faut :

1. Créer/mettre à jour le plat comme avant
2. Supprimer les anciennes lignes `dish_images` liées à ce plat (en mode édition)
3. Insérer les nouvelles lignes à partir du tableau `images` reçu

Exemple pour le PUT (`app/api/dishes/[id]/route.ts`) :

```ts
import { db } from "@/app/db";
import { dishes, dishImages } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const dishId = parseInt(id);
  const body = await req.json();
  const { name, description, price, categoryId, images } = body;
  // ... ta logique existante pour ingredients/allergens reste inchangée

  await db.transaction(async (tx) => {
    await tx
      .update(dishes)
      .set({ name, description, price, categoryId })
      .where(eq(dishes.id, dishId));

    // Remplace toutes les images existantes par le nouveau set
    await tx.delete(dishImages).where(eq(dishImages.dishId, dishId));

    if (images?.length) {
      await tx.insert(dishImages).values(
        images.map((img: { url: string; publicId: string }, i: number) => ({
          dishId,
          url: img.url,
          publicId: img.publicId,
          position: i,
        })),
      );
    }
  });

  return Response.json({ success: true });
}
```

Pour le POST (création), même logique mais après avoir récupéré l'`id` du plat fraîchement inséré.

> Adapte cet exemple à la structure exacte de tes routes actuelles (gestion des ingrédients/allergènes en plus, etc.) — l'essentiel est le pattern delete + insert pour les images.

---

## Points d'attention

- **`api_secret` ne doit jamais être exposé côté client** — uniquement dans les variables d'environnement serveur, sans préfixe `NEXT_PUBLIC_`.
- Si tu affiches les images via `next/image`, autorise le domaine Cloudinary dans `next.config.js` :
  ```js
  module.exports = {
    images: { domains: ["res.cloudinary.com"] },
  };
  ```
- Le `publicId` stocké en base te permettra plus tard d'ajouter la **suppression réelle sur Cloudinary** (via `cloudinary.uploader.destroy(publicId)`) quand une image est retirée — pour l'instant, le code ci-dessus la retire seulement de la base.
- Tu peux limiter formats/tailles côté Cloudinary via les **Upload Presets** sur ton dashboard, en complément de la validation côté client.
