import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import ingredientCategories from './enums/ingredientCategories.enum';
import { relations } from 'drizzle-orm';
import { ingredientsToRecipes } from '.';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const ingredients = pgTable('ingredients', {
	id: serial('id').primaryKey().notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	quantity: varchar('quantity', { length: 255 }),
	category: ingredientCategories(),
});

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
	recipes: many(ingredientsToRecipes),
}));

export const insertIngredientSchema = createInsertSchema(ingredients);
export const selectIngredientSchema = createSelectSchema(ingredients);

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type SelectIngredient = z.infer<typeof selectIngredientSchema>;

export default ingredients;
