import db, { Db } from '..';
import { faker } from '@faker-js/faker';
import ingredientsToRecipes, {
	InsertIngredientToRecipe,
} from '../schema/ingredientsToRecipes.schema';

const mock = async () => {
	const [recipes, ingredients] = await Promise.all([
		db.query.recipes.findMany(),
		db.query.ingredients.findMany(),
	]);

	const data: InsertIngredientToRecipe[] = [];

	recipes.forEach(recipe => {
		const numberOfIngredients = faker.number.int({ min: 4, max: 10 });

		const usedIngredientIds = new Set<number>();

		for (let i = 0; i < numberOfIngredients; i++) {
			let ingredient;
			do {
				ingredient = faker.helpers.arrayElement(ingredients);
			} while (ingredient && usedIngredientIds.has(ingredient.id));

			if (!ingredient) {
				console.error('No ingredient found for recipe:', recipe.id);
				continue;
			}

			usedIngredientIds.add(ingredient.id);

			data.push({
				recipeId: recipe.id,
				ingredientId: ingredient.id,
			});
		}
	});

	return data;
};

export async function seed(db: Db) {
	const data = await mock();
	if (data.length) {
		await db.insert(ingredientsToRecipes).values(data);
	} else {
		console.error('No data to insert');
	}
}
