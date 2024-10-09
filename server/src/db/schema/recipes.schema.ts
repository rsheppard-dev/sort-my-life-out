import { relations, sql } from 'drizzle-orm';
import {
	integer,
	interval,
	pgTable,
	serial,
	varchar,
} from 'drizzle-orm/pg-core';
import family from './families.schema';
import recipeCategoriesToRecipes from './recipeCategoriesToRecipes.schema';
import cuisinesToRecipes from './cuisinesToRecipes.schema';

const recipes = pgTable('recipes', {
	id: serial('id').primaryKey().notNull(),
	familyId: serial('family_id')
		.notNull()
		.references(() => family.id, { onDelete: 'cascade' }), // delete recipes when family is deleted
	name: varchar('name', { length: 255 }).notNull(),
	description: varchar('description', { length: 500 }),
	image: varchar('image', { length: 255 }),
	prepTime: interval('prep_time'),
	cookTime: interval('cook_time'),
	totalTime: interval('total_time'),
	servings: integer('servings'),
	ingredients: varchar('ingredients', { length: 255 })
		.array()
		.notNull()
		.default(sql`'{}'::text[]`),
	method: varchar('method', { length: 255 })
		.array()
		.notNull()
		.default(sql`'{}'::text[]`),
});

export const recipesRelations = relations(recipes, ({ many, one }) => ({
	categories: many(recipeCategoriesToRecipes),
	cuisines: many(cuisinesToRecipes),
	family: one(family, {
		fields: [recipes.familyId],
		references: [family.id],
	}),
}));

export default recipes;
