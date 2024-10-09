import { defineConfig } from 'drizzle-kit';
import env from './src/config/env.config';

export default defineConfig({
	out: './src/db/migrations',
	schema: './src/db/schema',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL!,
	},
});
