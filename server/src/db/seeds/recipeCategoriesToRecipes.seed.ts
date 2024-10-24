import db, { Db } from '..';
import { faker } from '@faker-js/faker';
import { recipeCategoriesToRecipes } from '../schema';
import { InsertRecipeCategoryToRecipe } from '../schema/recipeCategoriesToRecipes.schema';

const mock = async () => {
	const [categories, recipes] = await Promise.all([
		db.query.recipeCategories.findMany(),
		db.query.recipes.findMany(),
	]);

	const data: InsertRecipeCategoryToRecipe[] = [];

	recipes.forEach(recipe => {
		data.push({
			recipeId: recipe.id,
			recipeCategoryId: faker.helpers.arrayElement(categories).id, // Randomly assign a category to each recipe
		});
	});

	return data;
};

export async function seed(db: Db) {
	const data = await mock();
	await db.insert(recipeCategoriesToRecipes).values(data);
}
