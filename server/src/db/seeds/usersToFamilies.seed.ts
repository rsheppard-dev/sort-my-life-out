import db, { Db } from '..';
import { usersToFamilies } from '../schema';
import { InsertUserToFamily } from '../schema/usersToFamilies.schema';

const mock = async () => {
	const [user, family] = await Promise.all([
		db.query.users.findFirst(),
		db.query.families.findFirst(),
	]);

	const data: InsertUserToFamily = {
		userId: user?.id,
		familyId: family?.id,
	};

	return data;
};

export async function seed(db: Db) {
	const data = await mock();
	await db.insert(usersToFamilies).values(data);
}
