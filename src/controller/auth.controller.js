import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import { logger } from '../config/logger.js';
import prisma from '../../DB/db.config.js';
export class AuthController {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
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
            return res.status(201).json({ data: user });
        } catch (error) {
            return next(error);
        }
    };

    login = async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg));
        }

        const { email, password } = req.body;

        try {
            const isUser = await prisma.users.findUnique({
                where: { email },
            });
            if (!isUser) {
                return next(
                    createHttpError(400, 'Enter Valid Email or Password')
                );
            }
            const isValid = await bcrypt.compare(password, isUser.password);
            console.log(isValid);
            if (!isValid) {
                return next(createHttpError(400, 'Invalid Credentials!'));
            }
            const payload = {
                id: isUser.id,
                email: isUser.email,
                name: isUser.name,
                profile: isUser.profile,
            };

            const accessToken = await this.tokenService.generateAccessToken(
                payload
            );
            const persistRefreshToken =
                await this.tokenService.persistRefreshToken(isUser);

            const refreshToken = await this.tokenService.generateRefreshToken({
                ...payload,
                id: persistRefreshToken.id,
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            });
            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge:
                    1000 *
                    60 *
                    60 *
                    24 *
                    (new Date().getFullYear() % 4 === 0 ? 366 : 365), // TODO: check logic for leap years
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            });
            res.json({ data: 'login successFull', accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    };

    me = async (req, res,next) => {
        const user = req.user;
        console.log(user)
    }

    profileUpload = async (req, res, next) => {

    }

    logout = async (req, res, next) => {

    }
}
