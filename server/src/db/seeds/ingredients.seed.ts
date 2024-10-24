import { ingredients } from '../schema';
import { Db } from '..';
import { faker } from '@faker-js/faker';
import { InsertIngredient } from '../schema/ingredients.schema';
import ingredientCategoriesEnum from '../schema/enums/ingredientCategories.enum';

function generateQuantity() {
	const quantity = faker.number.int({ min: 1, max: 100 });
	const unit = faker.helpers.arrayElement([
		'g',
		'kg',
		'ml',
		'l',
		'tbsp',
		'tsp',
		'cup',
		'piece',
	]);
	return `${quantity} ${unit}`;
}

const mock = async () => {
	const data: InsertIngredient[] = [];

	for (let i = 0; i < 40; i++) {
		data.push({
			name: faker.food.ingredient(),
			quantity: generateQuantity(),
			category: faker.helpers.arrayElement(ingredientCategoriesEnum.enumValues),
		});
	}

	return data;
};

export async function seed(db: Db) {
	const data = await mock();
	await db.insert(ingredients).values(data);
}
