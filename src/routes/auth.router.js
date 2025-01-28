import { Router } from 'express';
import validateCreateUser from '../validator/create-user-validtor.js';
import { AuthController } from '../controller/auth.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const router = Router();

const authController = new AuthController();

router.post('/register', validateCreateUser,asyncWrapper(authController.register));

export default router;
