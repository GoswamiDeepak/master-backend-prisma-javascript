import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import prisma from '../../DB/db.config.js';

export class NewsController {
    //`* all news *
    async index(req, res, next) {}

    // * create news *
    async store(req, res, next) {
        //validate the req.body
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg));
        }
        const { title, content } = req.body;

        const imagePath = req.file.filename;

        const payload = {
            title,
            content,
            image: imagePath,
            user_id: req.user.id,
        };
        const news = await prisma.news.create({
            data: payload,
        });

        return res.status(201).json({ news });
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
        const id = req.params.id;
    }

    // * update news *
    async update(req, res, next) {
        const id = req.params.id;
    }

    // * delete news *
    async destroy(req, res, next) {
        const id = req.params.id;
    }
}
