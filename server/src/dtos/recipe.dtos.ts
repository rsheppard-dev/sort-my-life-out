import { z } from 'zod';

export const importRecipeDto = z.object({
	params: z.object({
		url: z.string().url(),
	}),
});

export type ImportRecipeParams = z.infer<typeof importRecipeDto>['params'];
