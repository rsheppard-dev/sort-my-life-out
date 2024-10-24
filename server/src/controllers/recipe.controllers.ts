import type { Request, Response } from 'express';
import { ImportRecipeParams } from '../dtos/recipe.dtos';
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

		let recipe: Recipe | null;

		if (value) {
			recipe = JSON.parse(value);
		} else {
			recipe = await scrapeRecipe(url);

			if (recipe) {
				await redisClient.set(key, JSON.stringify(recipe), {
					EX: 60 * 60 * 24, // 24 hours
				});
			}
		}

		res.send(recipe);
	} catch (error) {
		const errorMessage = 'An error occurred while importing the recipe.';

		logger.error(errorMessage, error);
		res.status(500).send(errorMessage);
	}
}
