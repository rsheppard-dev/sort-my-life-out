import type { Request, Response } from 'express';
import type {
	LoginDtoBody,
	SignUpDtoBody,
	VerifyEmailDtoBody,
} from '../dtos/auth.schema';
import logger from '../lib/logger';
import { signUpMainUser, verifyEmail } from '../services/auth.services';
import BadRequestError from '../errors/BadRequestError';
import DatabaseError from '../errors/DatabaseError';
import env from '../config/env.config';

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

	if (!user.id) throw new BadRequestError('Invalid verification code.');

	logger.info('Email verified successfully.');

	req.logIn(
		{
			id: user.id,
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
	res.send({
		cookie: req.session.cookie,
		user: req.user,
		isAuthenticated: req.isAuthenticated(),
	});
}

export async function loginHandler(
	req: Request<{}, {}, LoginDtoBody>,
	res: Response
) {
	res.status(200).send({
		cookie: req.session.cookie,
		user: req.user,
	});
}

export async function logoutHandler(req: Request, res: Response) {
	req.logOut(err => {
		if (err) {
			logger.error('An error occurred while logging out.', err);

			return res.status(500).send({
				message: 'An error occurred while logging out.',
			});
		}

		req.session.destroy(err => {
			if (err) {
				logger.error('An error occurred while destroying the session.', err);

				return res.status(500).send({
					message: 'An error occurred while destroying the session.',
				});
			}

			res.clearCookie('connect.sid');
			res.send({ message: 'Logged out successfully.' });
		});
	});
}

export async function updateSessionHandler(req: Request, res: Response) {
	req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week
	req.session.save(err => {
		if (err) {
			logger.error('An error occurred while saving the session.', err);
			return res.status(500).send({
				message: 'An error occurred while saving the session.',
			});
		}

		res.send({ message: 'Session updated successfully.' });
	});
}

export async function loginWithOAuthHandler(req: Request, res: Response) {
	res.redirect(env.ORIGIN + '/dashboard');
}
