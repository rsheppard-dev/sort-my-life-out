import { eq } from 'drizzle-orm';
import db from '../db';
import users, { SelectUser } from '../db/schema/users.schema';
import { accounts } from '../db/schema';
import { SelectAccount } from '../db/schema/accounts.schema';

export async function findUserByEmail(email: string) {
	const result = await db.query.users.findFirst({
		where: eq(users.email, email),
		with: {
			families: true,
			account: true,
		},
	});

	return result;
}

export async function findUserById(id: number) {
	const result = await db.query.users.findFirst({
		where: eq(users.id, id),
		with: {
			families: true,
			account: true,
		},
	});

	return result;
}

export async function updateUser(
	user: SelectUser & { account: SelectAccount }
) {
	user.updatedAt = new Date();

	const account = user.account;

	const result = await db.transaction(async tx => {
		let updatedUser;
		let updatedAccount;

		if (!!user) {
			[updatedUser] = await tx
				.update(users)
				.set(user)
				.where(eq(users.id, user.id))
				.returning();
		}

		if (!!account) {
			[updatedAccount] = await tx
				.update(accounts)
				.set(account)
				.where(eq(accounts.userId, user.id))
				.returning();
		}

		return { ...updatedUser, account: updatedAccount };
	});

	return result;
}
