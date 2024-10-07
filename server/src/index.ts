import express from 'express';
import { recipeRoutes } from './routes';
import env from './config/env.config';
import morgan from 'morgan';
import logger from './lib/logger';

const morganFormat = ':method :url :status :response-time ms';

const app = express();

app.use(
	morgan(morganFormat, {
		stream: {
			write: message => {
				const logObject = {
					method: message.split(' ')[0],
					url: message.split(' ')[1],
					status: message.split(' ')[2],
					responseTime: message.split(' ')[3],
				};

				logger.info(JSON.stringify(logObject));
			},
		},
	})
);

app.use('/api/recipes', recipeRoutes);

const PORT = env.PORT;

app.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT}`);
});
