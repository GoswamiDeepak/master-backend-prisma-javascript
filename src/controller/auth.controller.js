import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import { logger } from '../config/logger.js';
import prisma from '../../DB/db.config.js';
export class AuthController {
    register = async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty(req)) {
            return next(createHttpError(400, result.array()[0].msg));
        }
        const { name, email, password } = req.body;
        // * Check if email is already exist
        const user = await prisma.users.findUnique({
            where: { email: value },
        });
        if (user) {
            return next(createHttpError(400, 'Email is already exists.'));
        }
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        const data = {
            name,
            email,
            password: hashedPassword,
        };
        try {
            const user = await prisma.users.create({
                data,
            });
            return res.json({ data: user });
        } catch (error) {
            return next(error);
        }
    };

    login = async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg));
        }
    };
}
