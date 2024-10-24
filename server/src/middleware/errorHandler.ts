import type { NextFunction, Request, Response } from 'express';
import logger from '../lib/logger';
import CustomError from '../errors/CustomError';
import env from '../config/env.config';

const handleUniqueConstraintError = (res: Response, error: unknown) => {
	if (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		'constraint' in error &&
		'detail' in error &&
		(error as { code: string; constraint: string; detail: string }).code ===
			'23505'
	) {
		switch ((error as { constraint: string }).constraint) {
			case 'users_email_unique':
				res.status(409).json({
					message: 'A user with this email already exists.',
				});
				return true;
			default:
				res.status(409).json({
					message: (error as { detail: string }).detail,
				});
				return true;
		}
	}
	return false;
};

const developmentError = (res: Response, error: unknown) => {
	if (error instanceof CustomError) {
		res.status(error.statusCode).json(error.serialise());
	} else if (error instanceof Error) {
		res.status(500).json({
			statusCode: 500,
			message: 'An unknown error occurred.',
			stackTrace: error.stack,
			error,
		});
	} else {
		res.status(500).json({
			statusCode: 500,
			message: 'An unknown error occurred.',
		});
	}
};

const productionError = (res: Response, error: unknown) => {
	if (error instanceof CustomError) {
		res.status(error.statusCode).json(error.serialise());
	} else {
		res.status(500).json({
			statusCode: 500,
			message: 'An unknown error occurred.',
		});
	}
};

export default function errorHandler(
	error: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) {
	logger.error(error);

	if (handleUniqueConstraintError(res, error)) {
		return;
	}

	if (env.NODE_ENV === 'development') {
		developmentError(res, error);
	} else if (env.NODE_ENV === 'production') {
		productionError(res, error);
	} else {
		res.status(500).json({ message: 'An unknown error occurred.' });
	}
}
