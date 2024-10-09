import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import families from './families.schema';

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

export default recipeCategories;
