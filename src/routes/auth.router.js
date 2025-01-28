import { Router } from 'express';
import validateCreateUser from '../validator/create-user-validtor.js';
import { AuthController } from '../controller/auth.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import loginUserValidator from '../validator/login-user.validator.js';
import { TokenService } from '../services/tokenService.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const tokenService = new TokenService();
const authController = new AuthController(tokenService);

router.post(
    '/register',
    validateCreateUser,
    asyncWrapper(authController.register)
);
router.post('/login', loginUserValidator, asyncWrapper(authController.login));
router.get('/me', authMiddleware, asyncWrapper(authController.me));

export default router;
