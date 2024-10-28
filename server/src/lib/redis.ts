import { createClient } from 'redis';
import env from '../config/env.config';
import logger from './logger';
import RedisStore from 'connect-redis';

const redisClient = createClient({
	url: env.REDIS_URL,
});

export const redisStore = new RedisStore({
	client: redisClient,
});

redisClient.on('error', err => logger.error('Redis error:', err));
redisClient.on('connect', () => logger.info('Connected to Redis'));

if (!redisClient.isOpen) redisClient.connect();

export default redisClient;
