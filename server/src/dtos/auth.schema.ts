import { z } from 'zod';

const passwordRequirements = z
	.string()
	.min(8, { message: 'Password must be at least 8 characters long.' })
	.regex(/[0-9]/, { message: 'Password must contain at least one number.' })
	.regex(/[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`+= -]/, {
		message: 'Password must contain at least one special character.',
	})
	.regex(/[A-Z]/, {
		message: 'Password must contain at least one uppercase letter.',
	})
	.regex(/[a-z]/, {
		message: 'Password must contain at least one lowercase letter.',
	});

export const signUpDto = z.object({
	body: z.object({
		givenName: z.string().trim(),
		familyName: z.string().trim(),
		email: z.string().email().trim(),
		password: passwordRequirements,
	}),
});

export const verifyEmailDto = z.object({
	body: z.object({
		email: z.string().email().trim(),
		code: z.string().length(6),
	}),
});

export const loginDto = z.object({
	body: z.object({
		email: z.string().email().trim(),
		password: z.string(),
	}),
});

export type SignUpDtoBody = z.infer<typeof signUpDto>['body'];
export type VerifyEmailDtoBody = z.infer<typeof verifyEmailDto>['body'];
export type LoginDtoBody = z.infer<typeof loginDto>['body'];
