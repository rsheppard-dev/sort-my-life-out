import db, { type Db } from '..';
import accounts, { InsertAccount } from '../schema/accounts.schema';
import { generateVerificationCode } from '../../lib/utils';

const mock = async () => {
	const users = await db.query.users.findMany();

	const data: InsertAccount[] = [];

	users.forEach(user =>
		data.push({
			userId: user.id,
			verificationCode: generateVerificationCode(6),
		})
	);

	return data;
};

export async function seed(db: Db) {
	const data = await mock();
	await db.insert(accounts).values(data);
}
