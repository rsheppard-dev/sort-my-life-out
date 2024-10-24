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

export const signUpSchema = z
	.object({
		givenName: z.string().trim(),
		familyName: z.string().trim(),
		email: z.string().email().trim(),
		password: passwordRequirements,
		confirmPassword: passwordRequirements,
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	});

export const sendEmailVerificationSchema = z.object({
	email: z.string().trim().email(),
});

export const verifyEmailSchema = z.object({
	email: z.string().email().trim(),
	code: z
		.string()
		.min(6, { message: 'Verification code must be 6 digits long.' }),
});

export const loginSchema = z.object({
	email: z.string().trim().email(),
	password: z.string().trim(),
});

export const resetPasswordSchema = z.object({
	email: z.string().email().trim(),
});

export type SignUp = z.infer<typeof signUpSchema>;
export type SendEmailVerification = z.infer<typeof sendEmailVerificationSchema>;
export type VerifyEmail = z.infer<typeof verifyEmailSchema>;
export type Login = z.infer<typeof loginSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
