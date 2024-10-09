import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import users from './users.schema';
import recipes from './recipes.schema';
import recipeCategories from './recipeCategories.schema';
import cuisines from './cuisines.schema';

const families = pgTable('families', {
	id: serial('id').primaryKey().notNull(),
	name: varchar('name', { length: 255 }).notNull(),
});

export const familiesRelations = relations(families, ({ many }) => ({
	members: many(users),
	recipeCategories: many(recipeCategories),
	cuisines: many(cuisines),
	recipes: many(recipes),
}));

export default families;
