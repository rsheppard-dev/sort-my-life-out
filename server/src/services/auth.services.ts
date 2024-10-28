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
import AuthenticationError from '../errors/AuthenticationError';
import { Profile } from 'passport-google-oauth20';

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
	const message = 'Email or password is incorrect.';
	const user = await findUserByEmail(email);

	if (!user || !user.account || !user.account.password) {
		throw new AuthenticationError(message);
	}

	const verified = await verifyPassword(password, user.account.password);

	if (!verified) {
		throw new AuthenticationError(message);
	}

	return user;
}

export async function findOrCreateGoogleMainUser(data: Profile) {
	const {
		given_name: givenName,
		family_name: familyName,
		email,
		email_verified: emailVerified,
		picture,
	} = data._json;

	if (!email) {
		throw new BadRequestError('No email address found in Google profile.');
	}

	if (!givenName || !familyName) {
		throw new BadRequestError('No name found in Google profile.');
	}

	const existingUser = await findUserByEmail(email);

	// user exists but has no googleId
	if (existingUser?.account && !existingUser.account.googleId) {
		existingUser.account.googleId = data.id;
		existingUser.picture ??= picture ?? null;
		await updateUser(existingUser as SelectUser & { account: SelectAccount });
		// user exists and has googleId that doesn't match the current one
	} else if (existingUser && existingUser.account?.googleId !== data.id) {
		throw new BadRequestError('This Google account is already in use.');
	}

	if (existingUser) {
		return existingUser;
	} else {
		const newUser = await db.transaction(async tx => {
			const [family] = await tx
				.insert(families)
				.values({ name: `${familyName} Family` })
				.returning();
			const [user] = await tx
				.insert(users)
				.values({
					givenName,
					familyName,
					email,
					emailVerified,
					picture,
				})
				.returning();
			await tx.insert(accounts).values({
				userId: user.id,
				googleId: data.id,
			});
			await tx.insert(usersToFamilies).values({
				familyId: family.id,
				userId: user.id,
			});

			return user;
		});

		if (!newUser) throw new DatabaseError('Failed to create user.');

		return newUser;
	}
}
