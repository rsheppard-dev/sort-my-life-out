import db, { Db } from '..';
import { faker } from '@faker-js/faker';
import { cuisinesToRecipes } from '../schema';
import { InsertCuisineToRecipe } from '../schema/cuisinesToRecipes.schema';

const mock = async () => {
	const [cuisines, recipes] = await Promise.all([
		db.query.cuisines.findMany(),
		db.query.recipes.findMany(),
	]);

	const data: InsertCuisineToRecipe[] = [];

	recipes.forEach(recipe => {
		data.push({
			recipeId: recipe.id,
			cuisineId: faker.helpers.arrayElement(cuisines).id, // Randomly assign a cuisine to each recipe
		});
	});

	return data;
};

export async function seed(db: Db) {
	const data = await mock();
	await db.insert(cuisinesToRecipes).values(data);
}
