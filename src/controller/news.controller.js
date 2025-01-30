import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import prisma from '../../DB/db.config.js';
import fs from 'fs';
export class NewsController {
    //`* all news *
    async index(req, res, next) {
        try {
            // Convert string parameters to numbers
            let page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;

            // Validate pagination parameters
            if (page <= 0) page = 1;
            if (limit <= 0 || limit > 100) limit = 10;

            const skip = (page - 1) * limit;

            const news = await prisma.news.findMany({
                take: limit, // Now it's a number
                skip: skip, // Now it's a number
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc', // Latest news first
                },
            });

            const totalNews = await prisma.news.count();
            const totalPages = Math.ceil(totalNews / limit);

            const metaData = {
                totalNews,
                totalPages,
                currentPage: page,
                limit,
            };

            res.json({
                news,
                metaData,
            });
        } catch (error) {
            next(error);
        }
    }

    // * create news *
    async store(req, res, next) {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return next(createHttpError(400, result.array()[0].msg));
            }

            if (!req.file) {
                return next(createHttpError(400, 'Image is required'));
            }

            const { title, content } = req.body;
            const user_id = req.user.id;

            const news = await prisma.news.create({
                data: {
                    title,
                    content,
                    image: req.file.filename,
                    user_id: parseInt(user_id),
                },
            });

            res.status(201).json({
                message: 'News created successfully',
                data: news,
            });
        } catch (error) {
            next(error);
        }
        /*
        ----------for upload.fields([{name:'image', maxCount:1},{name:'thumbnail', maxCount: 1}])
        const payload = {
            title,
            content,
            image: req.files.image[0].filename,
            thumbnail: req.files.image[0].filename
        }
        console.log(payload)

        -------req.file for single image
        file: {
            fieldname: 'image',
            originalname: '1714111008754.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            destination: 'public/temp',
            filename: 'image-1738213153486.jpg',
            path: 'public\\temp\\image-1738213153486.jpg',
            size: 90393
          },
          */
    }

    // * single news *
    async show(req, res, next) {
        try {
            const id = req.params.id;
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id),
                },
            });
            res.json({ news });
        } catch (error) {
            next(error);
        }
    }

    // * update news *
    async update(req, res, next) {
        try {
            const id = req.params.id;
            const user = req.user;
            const { title, content } = req.body;
            // Find the news first
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id),
                },
            });

            if (!news) {
                return next(createHttpError(404, 'News not found'));
            }

            if (news.user_id !== user.id) {
                return next(
                    createHttpError(
                        403,
                        'Forbidden: You can only update your own news'
                    )
                );
            }

            const payload = {
                title,
                content,
            };

            if (req.file) {
                payload.image = req.file.filename;
            }

            const updatedNews = await prisma.news.update({
                data: payload,
                where: {
                    id: Number(id),
                },
            });

            res.status(200).json({
                message: 'News updated successfully',
                data: updatedNews,
            });
        } catch (error) {
            next(error);
        }
    }

    // * delete news *
    async destroy(req, res, next) {
        const id = req.params.id;
        const user = req.user;
        try {
            // Find the news first
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id),
                },
            });

            if (!news) {
                return next(createHttpError(404, 'News not found'));
            }

            if (news.user_id !== user.id) {
                return next(
                    createHttpError(
                        403,
                        'Forbidden: You can only update your own news'
                    )
                );
            }
            /**
             * delete from local file system
             * delete form s3
             * delete from cloudnary
             */
            const path = process.cwd() + '/public/temp/' + news.image;

            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
            }

            await prisma.news.delete({
                where: {
                    id: Number(id),
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
