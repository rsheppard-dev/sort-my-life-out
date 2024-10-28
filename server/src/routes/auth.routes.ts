import { Router } from 'express';
import '../lib/passport/local';
import '../lib/passport/google';
import {
	getSessionHandler,
	loginHandler,
	loginWithOAuthHandler,
	logoutHandler,
	signUpHandler,
	updateSessionHandler,
	verifyEmailHandler,
} from '../controllers/auth.controller';
import validateResource from '../middleware/validateResource';
import { loginDto, signUpDto, verifyEmailDto } from '../dtos/auth.schema';
import passport from 'passport';
import '../lib/passport/local';
import isAuthenticated from '../middleware/isAuthenticated';

const router = Router();

router.post('/', validateResource(signUpDto), signUpHandler);
router.post('/verify', validateResource(verifyEmailDto), verifyEmailHandler);

router.get('/', isAuthenticated, getSessionHandler);
router.patch('/', isAuthenticated, updateSessionHandler);
router.delete('/', isAuthenticated, logoutHandler);

router.post(
	'/credentials',
	validateResource(loginDto),
	passport.authenticate('credentials'),
	loginHandler
);

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);
router.get(
	'/google/callback',
	passport.authenticate('google'),
	loginWithOAuthHandler
);

export default router;
