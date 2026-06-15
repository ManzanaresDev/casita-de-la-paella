// db/seed.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  // Créer les catégories
  const [classiques, specialites, accompagnements] = await db
    .insert(schema.categories)
    .values([
      { slug: "classiques", label: "Paëllas classiques", position: 0 },
      { slug: "specialites", label: "Nos spécialités", position: 1 },
      { slug: "accompagnements", label: "Accompagnements", position: 2 },
    ])
    .returning();

  // Créer les plats
  const [valenciana, fruits, aioli] = await db
    .insert(schema.dishes)
    .values([
      {
        name: "Valenciana",
        description:
          "Poulet fermier, lapin, haricots plats, safran en pistils, cuit au feu de bois.",
        price: 14,
        emoji: "🥘",
        position: 0,
        categoryId: classiques.id,
      },
      {
        name: "Fruits de mer",
        description:
          "Crevettes royales, moules de bouchot, palourdes et encornets grillés.",
        price: 18,
        emoji: "🦞",
        featured: true,
        position: 0,
        categoryId: specialites.id,
      },
      {
        name: "Aïoli maison",
        description:
          "Monté à l'huile d'olive vierge extra, ail rose de Lautrec.",
        price: 3,
        emoji: "🧄",
        position: 0,
        categoryId: accompagnements.id,
      },
    ])
    .returning();

  // Ajouter des ingrédients
  await db.insert(schema.ingredients).values([
    { name: "Poulet fermier", dishId: valenciana.id },
    { name: "Lapin", dishId: valenciana.id },
    { name: "Safran", dishId: valenciana.id },
    { name: "Crevettes", dishId: fruits.id },
    { name: "Moules", dishId: fruits.id },
    { name: "Ail rose", dishId: aioli.id },
  ]);

  // Ajouter des allergènes
  await db.insert(schema.allergens).values([
    { name: "Crustacés", dishId: fruits.id },
    { name: "Mollusques", dishId: fruits.id },
  ]);

  console.log("✅ Base de données initialisée !");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
