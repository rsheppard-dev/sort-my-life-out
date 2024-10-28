import express from 'express';
import env from './config/env.config';
import logger from './lib/logger';
import cors, { CorsOptions } from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import formatLogger from './middleware/formatLogger';
import passport from 'passport';
import userRoutes from './routes/user.routes';
import recipeRoutes from './routes/recipe.routes';
import authRoutes from './routes/auth.routes';
import errorHandler from './middleware/errorHandler';
import { redisStore } from './lib/redis';

const app = express();

const allowedOrigins: string[] = [env.ORIGIN];

const corsOptions: CorsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void
	) => {
		if (allowedOrigins.includes(origin || '') || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
};

// middleware
app.use(formatLogger());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(
	session({
		secret: env.EXPRESS_SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
		},
		store: redisStore,
	})
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);

// error handler
app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT}`);
});
