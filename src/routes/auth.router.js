import { Router } from 'express';
import validateCreateUser from '../validator/create-user-validtor.js';
import { AuthController } from '../controller/auth.controller.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import loginUserValidator from '../validator/login-user.validator.js';
import { TokenService } from '../services/tokenService.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { uploadHandlers } from '../middleware/fileHandler.middleware.js';

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

// Single file upload
router.patch(
    '/profile/:id',
    authMiddleware,
    uploadHandlers.single('profile'),
    asyncWrapper(authController.profileUpload)
);

router.post('/refresh', asyncWrapper(authController.refreshAccessToken));

router.get('/logout', authMiddleware, asyncWrapper(authController.logout));

// Multiple files with same field
// router.post(
//     '/upload-gallery',
//     authMiddleware,
//     uploadHandlers.array('photos', 5),
//     asyncWrapper(authController.uploadGallery)
// );

// Multiple files with different fields
// router.post(
//     '/upload-documents',
//     authMiddleware,
//     uploadHandlers.fields([
//         { name: 'profile', maxCount: 1 },
//         { name: 'documents', maxCount: 3 },
//     ]),
//     asyncWrapper(authController.uploadDocuments)
// );

export default router;
