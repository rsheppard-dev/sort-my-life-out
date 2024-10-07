import type { Request, Response } from 'express';
import type {
	ImportRecipeParams,
	RecipeJsonResponse,
} from '../types/recipe.types';
import { scrapeRecipe } from '../services/recipe.services';
import redisClient from '../lib/redis';
import logger from '../lib/logger';

export async function importRecipeHandler(
	req: Request<ImportRecipeParams>,
	res: Response
) {
	try {
		const url = decodeURIComponent(req.params.url);
		const key = `import:${url.toLowerCase()}`;
		const value = await redisClient.get(key);

		let recipeData: RecipeJsonResponse;

		if (value) {
			recipeData = { recipe: JSON.parse(value), source: 'cache' };
		} else {
			recipeData = await scrapeRecipe(url);

			if (recipeData.recipe) {
				await redisClient.set(key, JSON.stringify(recipeData.recipe), {
					EX: 60 * 60 * 24, // 24 hours
				});
			}
		}

		res.send(recipeData);
	} catch (error) {
		const errorMessage = 'An error occurred while importing the recipe.';

		logger.error(errorMessage, error);
		res.status(500).send(errorMessage);
	}
}
