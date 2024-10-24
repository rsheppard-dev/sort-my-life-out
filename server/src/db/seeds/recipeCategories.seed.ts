import { eq } from 'drizzle-orm';
import db, { type Db } from '..';
import { families, recipeCategories } from '../schema';
import { InsertRecipeCategory } from '../schema/recipeCategories.schema';

const mock = async () => {
	const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];

	const familyId = (
		await db
			.select({ id: families.id })
			.from(families)
			.where(eq(families.name, 'Sheppard Family'))
	)[0].id;

	const data: InsertRecipeCategory[] = [];

	categories.forEach(name => data.push({ familyId, name }));

	return data;
};

export async function seed(db: Db) {
	const data = await mock();
	await db.insert(recipeCategories).values(data);
}
