import { eq } from 'drizzle-orm';
import { families, recipes } from '../schema';
import db, { Db } from '..';
import { faker } from '@faker-js/faker';
import { InsertRecipe } from '../schema/recipes.schema';

const generateMethod = (): string[] => {
	const instructions: string[] = [];
	const numberOfInstructions = faker.number.int({ min: 3, max: 10 });

	for (let i = 0; i < numberOfInstructions; i++) {
		instructions.push(faker.lorem.sentence());
	}

	return instructions;
};

// Function to generate a random interval in minutes
const generateIntervalInMinutes = (): number => {
	return faker.number.int({ min: 5, max: 120 });
};

// Function to convert minutes to ISO 8601 duration format
const convertMinutesToISO8601 = (minutes: number): string => {
	return `PT${minutes}M`;
};

const mock = async () => {
	const familyId = (
		await db
			.select({ id: families.id })
			.from(families)
			.where(eq(families.name, 'Sheppard Family'))
	)[0].id;

	const data: InsertRecipe[] = [];

	for (let i = 0; i < 10; i++) {
		const prepTimeMinutes = generateIntervalInMinutes();
		const cookTimeMinutes = generateIntervalInMinutes();
		const totalTimeMinutes = prepTimeMinutes + cookTimeMinutes;

		data.push({
			familyId,
			name: faker.food.dish(),
			description: faker.lorem.paragraph(),
			image: faker.image.urlLoremFlickr({ category: 'food' }),
			method: generateMethod(),
			prepTime: convertMinutesToISO8601(prepTimeMinutes), // Convert prep time to ISO 8601 format
			cookTime: convertMinutesToISO8601(cookTimeMinutes), // Convert cook time to ISO 8601 format
			totalTime: convertMinutesToISO8601(totalTimeMinutes), // Calculate and convert total time to ISO 8601 format
			servings: faker.number.int({ min: 1, max: 10 }),
		});
	}

	return data;
};

export async function seed(db: Db) {
	const data = await mock();
	await db.insert(recipes).values(data);
}
