import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, serial } from 'drizzle-orm/pg-core';
import cuisines from './cuisines.schema';
import recipes from './recipes.schema';

const cuisinesToRecipes = pgTable(
	'cuisines_to_recipes',
	{
		cuisineId: serial('cuisine_id').notNull(),
		recipeId: serial('recipe_id').notNull(),
	},
	table => ({
		pk: primaryKey({ columns: [table.cuisineId, table.recipeId] }),
	})
);

export const cuisinesToRecipesRelations = relations(
	cuisinesToRecipes,
	({ one }) => ({
		recipe: one(recipes, {
			fields: [cuisinesToRecipes.recipeId],
			references: [recipes.id],
		}),
		cuisine: one(cuisines, {
			fields: [cuisinesToRecipes.cuisineId],
			references: [cuisines.id],
		}),
	})
);

export default cuisinesToRecipes;
