import { Router } from 'express';
import '../lib/passport/local';
import {
	getSessionHandler,
	loginHandler,
	logoutHandler,
	signUpHandler,
	verifyEmailHandler,
} from '../controllers/auth.controller';
import validateResource from '../middleware/validateResource';
import { loginDto, signUpDto, verifyEmailDto } from '../dtos/auth.schema';
import passport from 'passport';

const router = Router();

router.get('/', getSessionHandler);

router.post('/', validateResource(signUpDto), signUpHandler);
router.post('/verify', validateResource(verifyEmailDto), verifyEmailHandler);
router.post(
	'/login',
	validateResource(loginDto),
	passport.authenticate('loginWithCredentials'),
	loginHandler
);
router.post('/logout', logoutHandler);

export default router;
