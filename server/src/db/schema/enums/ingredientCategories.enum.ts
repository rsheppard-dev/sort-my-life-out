import { pgEnum } from 'drizzle-orm/pg-core';

const ingredientCategoriesEnum = pgEnum('ingredient_categories', [
	'Proteins',
	'Vegetables',
	'Fruits',
	'Dairy',
	'Grains',
	'Legumes',
	'Herbs and Spices',
	'Oils and Fats',
	'Nuts and Seeds',
	'Baking and Cooking Essentials',
	'Sauces and Condiments',
	'Sweeteners',
	'Beverages',
	'Prepared Ingredients',
	'Seasonings',
]);

export default ingredientCategoriesEnum;
