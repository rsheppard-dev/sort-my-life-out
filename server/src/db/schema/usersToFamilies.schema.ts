import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, serial } from 'drizzle-orm/pg-core';
import { families, users } from '.';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const usersToFamilies = pgTable(
	'users_to_families',
	{
		userId: serial('user_id').notNull(),
		familyId: serial('family_id').notNull(),
	},
	table => ({
		pk: primaryKey({ columns: [table.userId, table.familyId] }),
	})
);

export const usersToFamiliesRelations = relations(
	usersToFamilies,
	({ one }) => ({
		user: one(users, {
			fields: [usersToFamilies.userId],
			references: [users.id],
		}),
		family: one(families, {
			fields: [usersToFamilies.familyId],
			references: [families.id],
		}),
	})
);

export const insertUsersToFamiliesSchema = createInsertSchema(usersToFamilies);
export const selectUsersToFamiliesSchema = createSelectSchema(usersToFamilies);

export type InsertUserToFamily = z.infer<typeof insertUsersToFamiliesSchema>;
export type SelectUserToFamily = z.infer<typeof selectUsersToFamiliesSchema>;

export default usersToFamilies;
