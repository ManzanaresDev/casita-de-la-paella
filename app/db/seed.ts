// db/seed.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  // Drop tables existantes
  await db.delete(schema.allergens);
  await db.delete(schema.ingredients);
  await db.delete(schema.dishes);
  await db.delete(schema.categories);
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
  // db/seed.ts — ajout dans le bloc dishes
  const [
    arrozBogavante,
    arrozNegro,
    arrozBanda,
    arrozCostra,
    paellaRoyale,
    alioli,
  ] = await db
    .insert(schema.dishes)
    .values([
      {
        name: "Arroz con bogavante",
        description:
          "Un des riz les plus populaires du littoral espagnol. Homard, crevettes et gambas, servi caldoso.",
        price: 22,
        position: 1,
        categoryId: specialites.id,
      },
      {
        name: "Arroz negro",
        description:
          "Riz noir à l'encre de seiche, sofrito, fumet de poisson maison et sélection de mollusques et fruits de mer.",
        price: 19,
        position: 2,
        categoryId: classiques.id,
      },
      {
        name: 'Arroz "a banda"',
        description:
          "Plat marin traditionnel à base de poissons de roche. Bouillon aux pommes de terre, riz sec et aïoli.",
        price: 18,
        position: 3,
        categoryId: specialites.id,
      },
      {
        name: "Arroz con costra",
        description:
          "Riz au lapin et au porc, cuit en cocotte de terre au four, nappé d'œuf battu pour une croûte dorée.",
        price: 17,
        position: 4,
        categoryId: classiques.id,
      },
      {
        name: "Paëlla Royale",
        description:
          "Paëlla généreuse aux fruits de mer, poulet et chorizo, servie avec langoustines.",
        price: 24,
        position: 5,
        categoryId: classiques.id,
      },
      {
        name: "Ali-oli maison",
        description:
          "Sauce traditionnelle à base d'ail et d'huile d'olive, idéale pour accompagner les paëllas et plats de riz.",
        price: 2,
        position: 1,
        categoryId: accompagnements.id,
      },
    ])
    .returning();

  // Ingrédients
  await db.insert(schema.ingredients).values([
    { name: "Homard", dishId: arrozBogavante.id },
    { name: "Gambas", dishId: arrozBogavante.id },
    { name: "Encre de seiche", dishId: arrozNegro.id },
    { name: "Calamar", dishId: arrozNegro.id },
    { name: "Pommes de terre", dishId: arrozBanda.id },
    { name: "Aïoli", dishId: arrozBanda.id },
    { name: "Lapin", dishId: arrozCostra.id },
    { name: "Porc", dishId: arrozCostra.id },
    { name: "Œuf", dishId: arrozCostra.id },
    { name: "Poulet (FR)", dishId: paellaRoyale.id },
    { name: "Riz", dishId: paellaRoyale.id },
    { name: "Oignons", dishId: paellaRoyale.id },
    { name: "Poivrons", dishId: paellaRoyale.id },
    { name: "Chorizo (UE)", dishId: paellaRoyale.id },
    { name: "Petits pois", dishId: paellaRoyale.id },
    { name: "Moules", dishId: paellaRoyale.id },
    { name: "Calamars", dishId: paellaRoyale.id },
    { name: "Crevettes", dishId: paellaRoyale.id },
    { name: "Langoustines", dishId: paellaRoyale.id },
  ]);

  // Allergènes
  await db.insert(schema.allergens).values([
    { name: "Crustacés", dishId: arrozBogavante.id },
    { name: "Mollusques", dishId: arrozNegro.id },
    { name: "Poisson", dishId: arrozNegro.id },
    { name: "Poisson", dishId: arrozBanda.id },
    { name: "Œuf", dishId: arrozCostra.id },
    { name: "Lactose", dishId: paellaRoyale.id },
    { name: "Crustacés", dishId: paellaRoyale.id },
    { name: "Mollusques", dishId: paellaRoyale.id },
    { name: "Poisson", dishId: paellaRoyale.id },
    { name: "Sulfites", dishId: paellaRoyale.id },
    { name: "Œuf", dishId: alioli.id },
  ]);

  console.log("✅ Base de données initialisée !");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
