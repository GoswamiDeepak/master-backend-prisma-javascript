import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { NewsController } from '../controller/news.controller.js';
import { uploadHandlers } from '../middleware/fileHandler.middleware.js';
import newsValidator from '../validator/news-validator.js';

const router = Router();
const newsController = new NewsController();

// router.post(
//     '/',
//     auth,
//     uploadHandlers.fields([
//         { name: 'image', maxCount: 1 },
//         { name: 'thumbnail', maxCount: 1 },
//     ]),
//     asyncWrapper(newsController.store)
// );
router.post(
    '/',
    // auth,
    uploadHandlers.single('image'),
    newsValidator,
    asyncWrapper(newsController.store)
);
router.get('/', asyncWrapper(newsController.index));
router.get('/:id', asyncWrapper(newsController.show));
router.put('/:id', auth, asyncWrapper(newsController.update));
router.delete('/:id', auth, asyncWrapper(newsController.destroy));

export default router;
