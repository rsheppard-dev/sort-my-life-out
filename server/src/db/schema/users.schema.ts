import {
	pgTable,
	varchar,
	date,
	boolean,
	timestamp,
	serial,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { accounts, usersToFamilies } from '.';
import { z } from 'zod';

const users = pgTable(
	'users',
	{
		id: serial('id').primaryKey().notNull(),
		givenName: varchar('given_name', { length: 255 }).notNull(),
		familyName: varchar('family_name', { length: 255 }).notNull(),
		dateOfBirth: date('date_of_birth', { mode: 'date' }),
		picture: varchar('picture', { length: 255 }),
		email: varchar('email', { length: 255 }).unique(),
		emailVerified: boolean('email_verified').notNull().default(false),
		isActive: boolean('is_active').notNull().default(true),
		isPro: boolean('is_pro').notNull().default(false),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	table => {
		return {
			emailIndex: uniqueIndex('email_idx').on(table.email),
		};
	}
);

export const usersRelations = relations(users, ({ one, many }) => ({
	families: many(usersToFamilies),
	account: one(accounts),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;

export default users;
