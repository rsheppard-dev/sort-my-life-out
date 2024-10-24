import db from '../db';
import { families, usersToFamilies } from '../db/schema';
import { InsertFamily } from '../db/schema/families.schema';

export async function createFamily(data: InsertFamily) {
	const family = await db.insert(families).values(data).returning();

	return family[0];
}

export async function addFamilyMember(familyId: number, userId: number) {
	const result = await db
		.insert(usersToFamilies)
		.values({ userId, familyId })
		.returning();

	return result[0];
}
