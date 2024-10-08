'use server';

import { actionClient } from '@/lib/safe-action';
import {
	ImportRecipeResponse,
	importRecipeSchema,
} from '@/schema/recipe.schema';
import { env } from '@/env.mjs';

export const importRecipeAction = actionClient
	.schema(importRecipeSchema.shape.request)
	.action(async ({ parsedInput: { url } }) => {
		const encodedUrl = encodeURIComponent(url);
		const response = await fetch(
			`${env.BASE_API_URL}/recipes/import/${encodedUrl}`
		);
		const recipe: ImportRecipeResponse = await response.json();

		if (!recipe)
			return {
				failure: 'Failed to import recipe.',
			};

		return {
			success: 'Successfully imported recipe.',
			recipe,
		};
	});
