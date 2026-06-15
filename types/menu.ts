// types/menu.ts
// Les types sont inférés directement depuis le schéma Drizzle — pas de doublon.
import type { InferSelectModel } from "drizzle-orm";
import type {
  categories,
  dishes,
  ingredients,
  allergens,
} from "@/app/db/schema";

export type Category = InferSelectModel<typeof categories>;
export type Dish = InferSelectModel<typeof dishes>;
export type Ingredient = InferSelectModel<typeof ingredients>;
export type Allergen = InferSelectModel<typeof allergens>;

// Types enrichis avec les relations pour l'affichage du menu
export type DishWithRelations = Dish & {
  ingredients: Ingredient[];
  allergens: Allergen[];
};

export type CategoryWithDishes = Category & {
  dishes: DishWithRelations[];
};
