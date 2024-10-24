import { z } from 'zod';

export const updateProfileSchema = z.object({
	givenName: z.string().trim().optional(),
	familyName: z.string().trim().optional(),
	dateOfBirth: z.date().optional(),
});

export const updateEmailSchema = z.object({
	email: z.string().email().trim(),
});

export const confirmEmailSchema = z.object({
	email: z.string().email().trim(),
	code: z
		.number()
		.min(6, { message: 'Verification code should be 6 digits long.' }),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type UpdateEmail = z.infer<typeof updateEmailSchema>;
