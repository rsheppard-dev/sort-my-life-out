import type { Db } from '..';
import { families } from '../schema';
import { InsertFamily } from '../schema/families.schema';

const mock: InsertFamily = {
	name: 'Sheppard Family',
};

export async function seed(db: Db) {
	await db.insert(families).values(mock);
}
