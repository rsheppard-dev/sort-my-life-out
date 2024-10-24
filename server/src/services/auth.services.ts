import * as argon2 from 'argon2';

import {
	LoginDtoBody,
	SignUpDtoBody,
	VerifyEmailDtoBody,
} from '../dtos/auth.schema';
import { generateVerificationCode } from '../lib/utils';
import usersToFamilies from '../db/schema/usersToFamilies.schema';
import accounts, { SelectAccount } from '../db/schema/accounts.schema';
import users, { SelectUser } from '../db/schema/users.schema';
import families from '../db/schema/families.schema';
import db from '../db';
import { sendEmail } from './email.services';
import { findUserByEmail, updateUser } from './user.services';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import DatabaseError from '../errors/DatabaseError';

export async function signUpMainUser({ password, ...values }: SignUpDtoBody) {
	const hashedPassword = await hashPassword(password);

	const { user, account } = await db.transaction(async tx => {
		const [family] = await tx
			.insert(families)
			.values({ name: `${values.familyName} Family` })
			.returning();
		const [user] = await tx.insert(users).values(values).returning();
		const [account] = await tx
			.insert(accounts)
			.values({
				userId: user.id,
				password: hashedPassword,
				verificationCode: generateVerificationCode(6),
			})
			.returning({ verificationCode: accounts.verificationCode });
		await tx.insert(usersToFamilies).values({
			familyId: family.id,
			userId: user.id,
		});

		return { user, account };
	});

	if (!user) throw new DatabaseError('User not created.');

	if (user.email) {
		sendEmail(
			user.email,
			'Please verify your email',
			`Please verify your email by entering this code: ${account.verificationCode}.`
		);
	}

	return user;
}

export async function hashPassword(password: string) {
	return await argon2.hash(password);
}

export async function verifyPassword(password: string, hashedPassword: string) {
	return await argon2.verify(hashedPassword, password);
}

export async function verifyEmail({ email, code }: VerifyEmailDtoBody) {
	const user = await findUserByEmail(email);

	if (!user) {
		throw new NotFoundError('No registered user with that email address.');
	}

	if (!user.account) {
		throw new NotFoundError('No account details found for that user.');
	}

	if (user.emailVerified) {
		throw new BadRequestError('This email has already been verified.');
	}

	if (user.account.verificationCode?.toString() !== code) {
		throw new BadRequestError('Verification code is incorrect.');
	}

	user.emailVerified = true;
	user.account.verificationCode = null;

	const updatedUser = await updateUser(
		user as SelectUser & { account: SelectAccount }
	);

	return updatedUser;
}

export async function login({ email, password }: LoginDtoBody) {
	const user = await findUserByEmail(email);

	if (!user || !user.account || !user.account.password) return null;

	const verified = await verifyPassword(password, user.account.password);

	return verified ? user : null;
}
