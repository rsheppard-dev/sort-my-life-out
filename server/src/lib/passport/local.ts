import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { login } from '../../services/auth.services';
import AuthenticationError from '../../errors/AuthenticationError';

passport.serializeUser((user: Express.User, cb) => {
	process.nextTick(() => cb(null, user));
});

passport.deserializeUser(async (user: Express.User, cb) => {
	process.nextTick(() => cb(null, user));
});

const loginWithCredentials = passport.use(
	'loginWithCredentials',
	new LocalStrategy({ usernameField: 'email' }, async (email, password, cb) => {
		const user = await login({ email, password });

		if (!user) {
			const error = new AuthenticationError('Email or password is incorrect.');
			return cb(error, false, { message: error.message });
		}

		if (!user.emailVerified) {
			const error = new AuthenticationError('Email not verified.');
			return cb(error, false, { message: error.message });
		}

		return cb(
			null,
			{
				id: user.id.toString(),
				name: `${user.givenName} ${user.familyName}`,
				email: user.email as string,
				picture: user.picture ?? undefined,
			},
			{ message: 'Logged in successfully.' }
		);
	})
);

export { loginWithCredentials };
