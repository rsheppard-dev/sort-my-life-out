import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { families } from '.';

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

export default cuisines;
