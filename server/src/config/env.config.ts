import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const stringBoolean = z.coerce
	.string()
	.transform(val => val === 'true')
	.default('false');

const schema = z.object({
	DB_HOST: z.string().default('localhost'),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
	DB_PORT: z.coerce.number().int().positive().default(5432),
	DATABASE_URL: z.string().url(),
	PORT: z.coerce.number().int().positive().default(8000),
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	OPENAI_API_SECRET_KEY: z.string(),
	BRIGHTDATA_HOST: z.string(),
	BRIGHTDATA_USERNAME: z.string(),
	BRIGHTDATA_PASSWORD: z.string(),
	REDIS_PASSWORD: z.string(),
	REDIS_URL: z.string(),
	BASE_URL: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	ORIGIN: z.string(),
	EXPRESS_SESSION_SECRET: z.string(),
	RESEND_API_KEY: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_KEY: z.string(),
	AWS_REGION: z.string(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
	console.log(
		'❌ Invalid environment variables:',
		JSON.stringify(parsed.error.format(), null, 4)
	);
	process.exit(1);
}

export default parsed.data;
