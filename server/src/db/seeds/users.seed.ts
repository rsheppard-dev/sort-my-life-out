import { faker } from '@faker-js/faker';
import { Db } from '..';
import { users } from '../schema';
import { InsertUser } from '../schema/users.schema';

const mock: InsertUser = {
	givenName: 'Roy',
	familyName: 'Sheppard',
	dateOfBirth: new Date('1983-06-30'),
	email: 'rsheppard83@gmail.com',
	emailVerified: true,
	picture: faker.image.avatar(),
};

export async function seed(db: Db) {
	await db.insert(users).values(mock);
}
