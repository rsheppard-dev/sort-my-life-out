import { relations, sql } from 'drizzle-orm';
import {
	integer,
	interval,
	pgTable,
	serial,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {
	ingredientsToRecipes,
	families,
	recipeCategoriesToRecipes,
	cuisinesToRecipes,
} from '.';
import { z } from 'zod';

const recipes = pgTable('recipes', {
	id: serial('id').primaryKey().notNull(),
	familyId: serial('family_id')
		.notNull()
		.references(() => families.id, { onDelete: 'cascade' }), // delete recipes when family is deleted
	name: varchar('name', { length: 255 }).notNull(),
	description: varchar('description', { length: 500 }),
	image: varchar('image', { length: 255 }),
	prepTime: interval('prep_time'),
	cookTime: interval('cook_time'),
	totalTime: interval('total_time'),
	servings: integer('servings'),
	method: varchar('method', { length: 255 })
		.array()
		.notNull()
		.default(sql`'{}'::varchar[]`),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const recipesRelations = relations(recipes, ({ many, one }) => ({
	categories: many(recipeCategoriesToRecipes),
	cuisines: many(cuisinesToRecipes),
	ingredients: many(ingredientsToRecipes),
	family: one(families, {
		fields: [recipes.familyId],
		references: [families.id],
	}),
}));

export const insertRecipeSchema = createInsertSchema(recipes, {
	method: schema => schema.method.array(),
});
export const selectRecipeSchema = createSelectSchema(recipes, {
	method: schema => schema.method.array(),
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type SelectRecipe = z.infer<typeof selectRecipeSchema>;

export default recipes;
