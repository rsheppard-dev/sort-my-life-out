import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, serial } from 'drizzle-orm/pg-core';
import { ingredients, recipes } from '.';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const ingredientsToRecipes = pgTable(
	'ingredients_to_recipes',
	{
		ingredientId: serial('ingredient_id').notNull(),
		recipeId: serial('recipe_id').notNull(),
	},
	table => ({
		pk: primaryKey({ columns: [table.ingredientId, table.recipeId] }),
	})
);

export const ingredientsToRecipesRelations = relations(
	ingredientsToRecipes,
	({ one }) => ({
		ingredient: one(ingredients, {
			fields: [ingredientsToRecipes.ingredientId],
			references: [ingredients.id],
		}),
		recipe: one(recipes, {
			fields: [ingredientsToRecipes.recipeId],
			references: [recipes.id],
		}),
	})
);

export const insertIngredientsToRecipesSchema =
	createInsertSchema(ingredientsToRecipes);
export const selectIngredientsToRecipesSchema =
	createSelectSchema(ingredientsToRecipes);

export type InsertIngredientToRecipe = z.infer<
	typeof insertIngredientsToRecipesSchema
>;
export type SelectIngredientToRecipe = z.infer<
	typeof selectIngredientsToRecipesSchema
>;

export default ingredientsToRecipes;
