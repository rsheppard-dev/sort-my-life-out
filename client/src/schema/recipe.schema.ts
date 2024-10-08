import { z } from 'zod';

export const importRecipeSchema = z.object({
	request: z.object({
		url: z.string().url(),
	}),
	response: z.object({
		name: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),
		prepTime: z.string().optional(),
		cookTime: z.string().optional(),
		totalTime: z.string().optional(),
		servings: z.string().optional(),
		category: z.string().optional(),
		cuisine: z.string().optional(),
		ingredients: z.array(z.string()),
		instructions: z.array(z.string()),
	}),
});

export type ImportRecipeRequest = z.infer<typeof importRecipeSchema>['request'];
export type ImportRecipeResponse = z.infer<
	typeof importRecipeSchema
>['response'];
