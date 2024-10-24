import { eq } from 'drizzle-orm';
import db, { type Db } from '..';
import { families, cuisines } from '../schema';
import { InsertCuisine } from '../schema/cuisines.schema';

const mock = async () => {
	const cuisines = [
		'American',
		'Italian',
		'Mexican',
		'Chinese',
		'Japanese',
		'Indian',
		'Thai',
		'Mediterranean',
		'French',
		'Greek',
		'Spanish',
		'German',
		'British',
		'Irish',
		'Scottish',
		'African',
		'Middle Eastern',
		'Caribbean',
		'South American',
		'Australian',
		'New Zealand',
		'Canadian',
		'Eastern European',
		'Nordic',
	];

	const familyId = (
		await db
			.select({ id: families.id })
			.from(families)
			.where(eq(families.name, 'Sheppard Family'))
	)[0].id;

	const data: InsertCuisine[] = [];

	cuisines.forEach(name => data.push({ familyId, name }));

	return data;
};

export async function seed(db: Db) {
	const data = await mock();
	await db.insert(cuisines).values(data);
}
