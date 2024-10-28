import passport from 'passport';
import {
	Strategy as GoogleStrategy,
	type Profile,
	type StrategyOptions,
	type VerifyCallback,
} from 'passport-google-oauth20';
import env from '../../config/env.config';
import { findOrCreateGoogleMainUser } from '../../services/auth.services';
import AuthenticationError from '../../errors/AuthenticationError';

const strategyOptions: StrategyOptions = {
	clientID: env.GOOGLE_CLIENT_ID,
	clientSecret: env.GOOGLE_CLIENT_SECRET,
	callbackURL: '/api/auth/google/callback',
};

const verifyFunction: (
	accessToken: string,
	refreshToken: string,
	profile: Profile,
	done: VerifyCallback
) => void = async (accessToken, refreshToken, profile, cb) => {
	const user = await findOrCreateGoogleMainUser(profile);

	if (!user) {
		const error = new AuthenticationError(
			'Unable to authenticate through Google.'
		);
		return cb(error, false, { message: error.message });
	}

	if (!user.emailVerified) {
		const error = new AuthenticationError('Email not verified.');
		return cb(error, false, { message: error.message });
	}

	cb(null, {
		id: user.id,
		email: user.email as string,
		name: `${user.givenName} ${user.familyName}`,
		picture: user.picture ?? undefined,
	});
};

const strategy = new GoogleStrategy(strategyOptions, verifyFunction);

passport.use('google', strategy);
