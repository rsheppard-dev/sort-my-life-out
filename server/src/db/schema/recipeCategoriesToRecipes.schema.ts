import { pgTable, primaryKey, serial } from 'drizzle-orm/pg-core';
import recipes from './recipes.schema';
import recipeCategories from './recipeCategories.schema';
import { relations } from 'drizzle-orm';

const recipeCategoriesToRecipes = pgTable(
	'recipe_categories_to_recipes',
	{
		recipeId: serial('recipe_id')
			.notNull()
			.references(() => recipes.id, { onDelete: 'cascade' }), // Cascade delete when recipe is deleted,
		recipeCategoryId: serial('recipe_category_id')
			.notNull()
			.references(() => recipeCategories.id, { onDelete: 'cascade' }), // Cascade delete when recipe category is deleted
	},
	table => ({
		pk: primaryKey({ columns: [table.recipeId, table.recipeCategoryId] }),
	})
);

export const recipeCategoriesToRecipesRelations = relations(
	recipeCategoriesToRecipes,
	({ one }) => ({
		recipe: one(recipes, {
			fields: [recipeCategoriesToRecipes.recipeId],
			references: [recipes.id],
		}),
		category: one(recipeCategories, {
			fields: [recipeCategoriesToRecipes.recipeCategoryId],
			references: [recipeCategories.id],
		}),
	})
);

export default recipeCategoriesToRecipes;