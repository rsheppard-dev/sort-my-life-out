import { pgTable, serial, varchar, date } from 'drizzle-orm/pg-core';
import families from './families.schema';
import { relations } from 'drizzle-orm';

const users = pgTable('users', {
	id: serial('id').primaryKey().notNull(),
	familyId: serial('family_id')
		.notNull()
		.references(() => families.id, { onDelete: 'restrict' }), // Restricts deletion of family if associated users exist,
	cognitoId: varchar('cognitoId', { length: 255 }),
	givenName: varchar('givenName', { length: 255 }).notNull(),
	familyName: varchar('familyName', { length: 255 }).notNull(),
	dateOfBirth: date('date_of_birth', { mode: 'date' }).notNull(),
	picture: varchar('picture', { length: 255 }),
	email: varchar('email', { length: 255 }).unique(),
	password: varchar('password', { length: 255 }),
});

export const usersRelations = relations(users, ({ one }) => ({
	family: one(families, {
		fields: [users.familyId],
		references: [families.id],
	}),
}));

export default users;
