import { createClient } from 'redis';
import env from '../config/env.config';
import logger from './logger';

const redisClient = createClient({
	url: env.REDIS_URL,
});

(async () => {
	redisClient.on('error', err => logger.error('Redis error:', err));
	redisClient.on('connect', () => logger.info('Connected to Redis'));

	await redisClient.connect();
})();

export default redisClient;
