import type { NextFunction, Request, Response } from 'express';
import AuthenticationError from '../errors/AuthenticationError';

export default function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.isAuthenticated()) {
		const error = new AuthenticationError('User is not authenticated.');
		next(error);
	}

	next();
}
