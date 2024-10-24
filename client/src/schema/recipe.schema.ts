import { z } from 'zod';

export const importRecipeSchema = z.object({
	request: z.object({
		url: z.string().url(),
	}),
	response: z.object({
		name: z.string().trim(),
		description: z.string().trim().optional(),
		image: z.string().trim().optional(),
		prepTime: z.string().trim().optional(),
		cookTime: z.string().trim().optional(),
		totalTime: z.string().trim().optional(),
		servings: z.string().trim().optional(),
		category: z.string().trim().optional(),
		cuisine: z.string().trim().optional(),
		ingredients: z.array(z.string().trim()),
		instructions: z.array(z.string().trim()),
	}),
});

export type ImportRecipeRequest = z.infer<typeof importRecipeSchema>['request'];
export type ImportRecipeResponse = z.infer<
	typeof importRecipeSchema
>['response'];
