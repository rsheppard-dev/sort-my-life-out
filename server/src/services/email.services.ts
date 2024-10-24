import logger from '../lib/logger';
import { sesClient } from '../config/aws.config';
import {
	SendEmailRequest,
	SendTemplatedEmailRequest,
} from '@aws-sdk/client-ses';
import BadRequestError from '../errors/BadRequestError';

export async function sendEmail(
	email: string | string[],
	subject: string,
	text?: string,
	html?: string
) {
	const params: SendEmailRequest = {
		Destination: {
			ToAddresses: Array.isArray(email) ? email : [email],
		},
		Source: 'Sort My Life Out <noreply@sortmylifeout.io>',
		Message: {
			Body: {
				Text: {
					Data: text,
				},
				Html: {
					Data: html,
				},
			},
			Subject: {
				Data: subject,
			},
		},
	};

	sesClient.sendEmail(params, (error: unknown) => {
		if (error) {
			logger.error('Email not sent:', error);
			throw new BadRequestError('Verification email failed to send.');
		}
	});
}

export async function sendTemplatedEmail(
	templatedEmailParams: SendTemplatedEmailRequest
) {
	const data = await sesClient.sendTemplatedEmail(templatedEmailParams);
	logger.info('Email sent:', data);
}
