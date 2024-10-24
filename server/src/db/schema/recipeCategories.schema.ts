import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import families from './families.schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const recipeCategories = pgTable('recipe_categories', {
	id: serial('id').primaryKey().notNull(),
	familyId: serial('family_id').notNull(),
	name: varchar('name', { length: 255 }).notNull(),
});

export const recipeCategoriesRelations = relations(
	recipeCategories,
	({ one }) => ({
		family: one(families, {
			fields: [recipeCategories.familyId],
			references: [families.id],
		}),
	})
);

export const insertRecipeCategorySchema = createInsertSchema(recipeCategories);
export const selectRecipeCategorySchema = createSelectSchema(recipeCategories);

export type InsertRecipeCategory = z.infer<typeof insertRecipeCategorySchema>;
export type SelectRecipeCategory = z.infer<typeof selectRecipeCategorySchema>;

export default recipeCategories;
