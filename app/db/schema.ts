// db/shchema.ts
import {
  pgTable,
  serial,
  text,
  real,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Catégorie de plat (colonne du menu)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // "classiques" | "specialites" | "accompagnements"
  label: text("label").notNull(), // "Paëllas classiques"
  position: integer("position").notNull().default(0),
});

// Un plat du menu
export const dishes = pgTable("dishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  emoji: text("emoji").notNull().default("🥘"),
  featured: boolean("featured").notNull().default(false), // mis en avant (colonne centre)
  available: boolean("available").notNull().default(true), // visible sur le menu
  position: integer("position").notNull().default(0), // ordre d'affichage
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Ingrédient d'un plat
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dishId: integer("dish_id")
    .notNull()
    .references(() => dishes.id, { onDelete: "cascade" }),
});

// Allergène d'un plat
export const allergens = pgTable("allergens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Gluten", "Crustacés", "Œufs"...
  dishId: integer("dish_id")
    .notNull()
    .references(() => dishes.id, { onDelete: "cascade" }),
});

// Relations Drizzle (pour les requêtes avec jointures via db.query)
export const categoriesRelations = relations(categories, ({ many }) => ({
  dishes: many(dishes),
}));

export const dishesRelations = relations(dishes, ({ one, many }) => ({
  category: one(categories, {
    fields: [dishes.categoryId],
    references: [categories.id],
  }),
  ingredients: many(ingredients),
  allergens: many(allergens),
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  dish: one(dishes, { fields: [ingredients.dishId], references: [dishes.id] }),
}));

export const allergensRelations = relations(allergens, ({ one }) => ({
  dish: one(dishes, { fields: [allergens.dishId], references: [dishes.id] }),
}));
