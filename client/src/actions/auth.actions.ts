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
import { cookies } from 'next/headers';
import { parseCookieString } from '@/lib/utils';

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
	.action(async ({ parsedInput: { email, password } }) => {
		const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth/credentials';

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

			return {
				message: data.message ?? 'An error occurred during login.',
				success: false,
			};
		}

		const cookie = response.headers.get('set-cookie');
		const parsedCookie = cookie
			? parseCookieString(cookie, 'connect.sid')
			: null;

		if (!!parsedCookie?.value) {
			const { value, httpOnly, secure, expires, path } = parsedCookie;

			const cookieStore = await cookies();
			cookieStore.set('connect.sid', value, {
				httpOnly,
				secure,
				expires: expires ? new Date(expires) : undefined,
				path,
			});
		}

		redirect('/dashboard');
	});

export async function login(prevState: unknown, formData: FormData) {
	const result = loginSchema.safeParse(Object.fromEntries(formData));

	if (!result.success) {
		return {
			message: 'There are validation errors.',
			errors: result.error.flatten().fieldErrors,
			success: false,
		};
	}

	const { email, password } = result.data;
	const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth/credentials';

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

		return {
			message: data.message ?? 'An error occurred during login.',
			success: false,
		};
	}

	const cookie = response.headers.get('set-cookie');
	const parsedCookie = cookie ? parseCookieString(cookie, 'connect.sid') : null;

	if (!!parsedCookie?.value) {
		const { value, httpOnly, secure, expires, path } = parsedCookie;

		const cookieStore = await cookies();
		cookieStore.set('connect.sid', value, {
			httpOnly,
			secure,
			expires: expires ? new Date(expires) : undefined,
			path,
		});
	}

	redirect('/dashboard');
}

export const logoutAction = actionClient.action(
	async (): Promise<ActionProps> => {
		const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth';

		const cookieStore = await cookies();
		const cookie = cookieStore.get('connect.sid');

		const response = await fetch(endpoint, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookie ? `${cookie.name}=${cookie.value}` : '',
			},
			next: {
				tags: ['user'],
			},
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				message: data.message ?? 'An error occurred while logging out.',
				success: false,
			};
		}

		const cookieSore = await cookies();
		cookieSore.delete('connect.sid');

		redirect('/login');
	}
);

export async function logout(): Promise<ActionProps> {
	const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth';

	const cookieStore = await cookies();
	const cookie = cookieStore.get('connect.sid');

	const response = await fetch(endpoint, {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookie ? `${cookie.name}=${cookie.value}` : '',
		},
		next: {
			tags: ['user'],
		},
	});

	const data = await response.json();

	if (!response.ok) {
		return {
			message: data.message ?? 'An error occurred while logging out.',
			success: false,
		};
	}

	const cookieSore = await cookies();
	cookieSore.delete('connect.sid');

	redirect('/login');
}

export async function getSession(): Promise<Session> {
	const cookieStore = await cookies();
	const cookie = cookieStore.get('connect.sid');

	const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth';

	const response = await fetch(endpoint, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookie ? `${cookie.name}=${cookie.value}` : '',
		},
		next: {
			tags: ['user'],
		},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(
			data.message ?? 'An error occurred while fetching session.'
		);
	}

	return data as Session;
}

export async function updateSession() {
	const cookieStore = await cookies();
	const cookie = cookieStore.get('connect.sid');

	const endpoint = env.NEXT_PUBLIC_BASE_API_URL + '/api/auth';

	const response = await fetch(endpoint, {
		method: 'PATCH',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookie ? `${cookie.name}=${cookie.value}` : '',
		},
		next: {
			tags: ['user'],
		},
	});

	if (!response.ok) {
		cookieStore.delete('connect.sid');
		return {
			isAuthenticated: false,
		};
	}

	const newCookie = response.headers.get('set-cookie');

	const parsedCookie = newCookie
		? parseCookieString(newCookie, 'connect.sid')
		: null;

	if (!!parsedCookie?.value) {
		const { value, httpOnly, secure, expires, path } = parsedCookie;

		cookieStore.set('connect.sid', value, {
			httpOnly,
			secure,
			expires: expires ? new Date(expires) : undefined,
			path,
		});
	}

	return {
		isAuthenticated: true,
	};
}
