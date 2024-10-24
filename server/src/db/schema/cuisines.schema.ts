import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { families } from '.';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const cuisines = pgTable('cuisines', {
	id: serial('id').primaryKey().notNull(),
	familyId: serial('family_id').notNull(),
	name: varchar('name', { length: 255 }).notNull(),
});

export const cuisinesRelations = relations(cuisines, ({ one }) => ({
	family: one(families, {
		fields: [cuisines.familyId],
		references: [families.id],
	}),
}));

export const insertCuisineSchema = createInsertSchema(cuisines);
export const selectCuisineSchema = createSelectSchema(cuisines);

export type InsertCuisine = z.infer<typeof insertCuisineSchema>;
export type SelectCuisine = z.infer<typeof selectCuisineSchema>;

export default cuisines;
