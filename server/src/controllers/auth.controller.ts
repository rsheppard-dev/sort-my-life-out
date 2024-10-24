import type { Request, Response } from 'express';
import type {
	LoginDtoBody,
	SignUpDtoBody,
	VerifyEmailDtoBody,
} from '../dtos/auth.schema';
import logger from '../lib/logger';
import { signUpMainUser, verifyEmail } from '../services/auth.services';
import AuthenticationError from '../errors/AuthenticationError';
import BadRequestError from '../errors/BadRequestError';
import DatabaseError from '../errors/DatabaseError';

export async function signUpHandler(
	req: Request<{}, {}, SignUpDtoBody>,
	res: Response
) {
	logger.info('Signing up user...');
	const user = await signUpMainUser({ ...req.body });

	if (!user) throw new DatabaseError('User could not be signed up.');

	logger.info('User signed up successfully.');

	res.status(201).send(user);
}

export async function verifyEmailHandler(
	req: Request<{}, {}, VerifyEmailDtoBody>,
	res: Response
) {
	const user = await verifyEmail(req.body);

	if (!user) throw new BadRequestError('Invalid verification code.');

	logger.info('Email verified successfully.');

	req.logIn(
		{
			id: user.id?.toString() ?? '',
			name: `${user.givenName} ${user.familyName}`,
			email: user.email as string,
			picture: user.picture ?? undefined,
		},
		err => {
			if (err) {
				logger.error('An error occurred while logging in.', err);
				throw new BadRequestError('An error occurred while logging in.');
			}
			res.send(user);
		}
	);
}

export async function getSessionHandler(req: Request, res: Response) {
	try {
		logger.info(req.user);
		logger.info(req.isAuthenticated());
		res.send(req.user);
	} catch (err) {
		const error = err as Error;

		logger.error('An error occurred while getting session.', error);

		res.status(500).send({
			message: error.message ?? 'An error occurred while getting session.',
		});
		return;
	}
}

export async function loginHandler(
	req: Request<{}, {}, LoginDtoBody>,
	res: Response
) {
	const user = req.user;

	if (!user) {
		throw new AuthenticationError('User not found.');
	}

	res.status(200).send(user);
}

export async function logoutHandler(req: Request, res: Response) {
	req.logOut(err => {
		if (err) {
			logger.error('An error occurred while logging out.', err);

			res.status(500).send({
				message: 'An error occurred while logging out.',
			});
			return;
		}

		res.send({ message: 'Logged out successfully.' });
	});
}
