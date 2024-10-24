'use server';

import { env } from '@/config/env.mjs';
import { actionClient } from '@/lib/safe-action';
import {
	loginSchema,
	signUpSchema,
	verifyEmailSchema,
} from '@/schema/auth.schema';
import { flattenValidationErrors } from 'next-safe-action';
import { redirect } from 'next/navigation';

type ActionProps = {
	message?: string;
	success: boolean;
};

export const signUpAction = actionClient
	.schema(signUpSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(
		async ({
			parsedInput: { email, password, givenName, familyName },
		}): Promise<ActionProps> => {
			const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth';
			const response = await fetch(endpoint, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
					givenName,
					familyName,
				}),
				next: {
					tags: ['user'],
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message ?? 'An error occurred during sign up.');
			}

			const params = new URLSearchParams({ email }).toString();
			redirect('/signup/verify?' + params);
		}
	);

export const verifyEmailAction = actionClient
	.schema(verifyEmailSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput: { email, code } }): Promise<ActionProps> => {
		const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth/verify';
		const response = await fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				code,
			}),
			next: {
				tags: ['user'],
			},
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				data.message ?? 'An error occurred verifying your email.'
			);
		}

		redirect('/dashboard');
	});

export const loginAction = actionClient
	.schema(loginSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(
		async ({ parsedInput: { email, password } }): Promise<ActionProps> => {
			const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth/login';
			const response = await fetch(endpoint, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
				next: {
					tags: ['user'],
				},
			});

			const data = await response.json();

			if (!response.ok) {
				if (data.message === 'Email not verified.') {
					const params = new URLSearchParams({ email }).toString();
					redirect('/signup/verify?' + params);
				}

				throw new Error(data.message ?? 'An error occurred during login.');
			}

			redirect('/dashboard');
		}
	);

export const logoutAction = actionClient.action(
	async (): Promise<ActionProps> => {
		const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth/logout';
		const response = await fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			next: {
				tags: ['user'],
			},
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message ?? 'An error occurred while logging out.');
		}

		redirect('/login');
	}
);
