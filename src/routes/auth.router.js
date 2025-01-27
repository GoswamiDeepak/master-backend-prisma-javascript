import { Router } from 'express';
import validateCreateUser from '../validator/create-user-validtor.js';
import { AuthController } from '../controller/auth.controller.js';

const router = Router();

const authCotroller = new AuthController();

router.post('/register', authCotroller.register);

export default router;
