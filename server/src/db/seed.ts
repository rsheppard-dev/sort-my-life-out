import { sql, Table } from 'drizzle-orm';
import type { Db } from '.';
import * as schema from './schema';
import { seed, seed as seedFamilies } from './seeds/families.seed';
import { seed as seedUsers } from './seeds/users.seed';
import { seed as seedUsersToFamilies } from './seeds/usersToFamilies.seed';
import { seed as seedRecipeCategories } from './seeds/recipeCategories.seed';
import { seed as seedCuisines } from './seeds/cuisines.seed';
import { seed as seedRecipes } from './seeds/recipes.seed';
import { seed as seedRecipeCategoriesToRecipes } from './seeds/recipeCategoriesToRecipes.seed';
import { seed as seedCuisinesToRecipes } from './seeds/cuisinesToRecipes.seed';
import { seed as seedIngredients } from './seeds/ingredients.seed';
import { seed as seedIngredientsToRecipes } from './seeds/ingredientsToRecipes.seed';
import { seed as seedAccounts } from './seeds/accounts.seed';

import db from '.';
import logger from '../lib/logger';

async function resetTable(db: Db, table: Table) {
	return db.execute(sql`truncate table ${table} restart identity cascade`);
}

async function main() {
	for (const table of [
		schema.families,
		schema.users,
		schema.accounts,
		schema.usersToFamilies,
		schema.recipeCategories,
		schema.cuisines,
		schema.ingredients,
		schema.recipes,
		schema.ingredientsToRecipes,
		schema.recipeCategoriesToRecipes,
		schema.cuisinesToRecipes,
	]) {
		await resetTable(db, table);
	}

	// await seedFamilies(db);
	// await seedUsers(db);
	// await seedAccounts(db);
	// await seedUsersToFamilies(db);
	// await seedRecipeCategories(db);
	// await seedCuisines(db);
	// await seedIngredients(db);
	// await seedRecipes(db);
	// await seedRecipeCategoriesToRecipes(db);
	// await seedCuisinesToRecipes(db);
	// await seedIngredientsToRecipes(db);
}

main()
	.catch(e => {
		logger.error(e);
		process.exit(1);
	})
	.finally(async () => {
		logger.info('Seeding complete!');
		process.exit(0);
	});
