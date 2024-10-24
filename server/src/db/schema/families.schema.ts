import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import recipes from './recipes.schema';
import recipeCategories from './recipeCategories.schema';
import cuisines from './cuisines.schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import usersToFamilies from './usersToFamilies.schema';
import { z } from 'zod';

const families = pgTable('families', {
	id: serial('id').primaryKey().notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const familiesRelations = relations(families, ({ many }) => ({
	members: many(usersToFamilies),
	recipeCategories: many(recipeCategories),
	cuisines: many(cuisines),
	recipes: many(recipes),
}));

export const insertFamilySchema = createInsertSchema(families);
export const selectFamilySchema = createSelectSchema(families);

export type InsertFamily = z.infer<typeof insertFamilySchema>;
export type SelectFamily = z.infer<typeof selectFamilySchema>;

export default families;
