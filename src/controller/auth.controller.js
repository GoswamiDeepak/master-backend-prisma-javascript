import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import { logger } from '../config/logger.js';
import prisma from '../../DB/db.config.js';
import { config } from '../config/index.js';
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

    me = async (req, res, next) => {
        const user = req.user;
        console.log(user);
    };

    profileUpload = async (req, res, next) => {
        try {
            if (!req.file) {
                return next(createHttpError(400, 'Please upload a file'));
            }

            // Access uploaded file
            const file = req.file;

            // Update user profile
            const updatedUser = await prisma.users.update({
                where: { id: parseInt(req.params.id) },
                data: { profile: file.filename },
            });

            res.json({
                message: 'Profile updated successfully',
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    };

    refreshAccessToken = async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return next(createHttpError(401, 'Refresh token not found'));
            }

            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, config.refreshKey);
            if (!decoded) {
                return next(createHttpError(401, 'Invalid refresh token'));
            }

            // Generate new tokens
            const user = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                profile: decoded.profile,
            };

            const newAccessToken = this.tokenService.generateAccessToken(user);
            const newRefreshToken =
                this.tokenService.generateRefreshToken(user);

            // Set the new refresh token in cookie
            res.cookie('refreshToken', newRefreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge:
                    1000 *
                    60 *
                    60 *
                    24 *
                    (new Date().getFullYear() % 4 === 0 ? 366 : 365),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            });

            res.json({
                message: 'Token refreshed successfully',
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next(createHttpError(401, 'Refresh token has expired'));
            }
            next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            // Find and delete refresh token from database
            const token = await prisma.refreshTokens.findFirst({
                where: {
                    userId: req.user.id,
                },
            });

            if (token) {
                await prisma.refreshTokens.delete({
                    where: {
                        id: token.id,
                    },
                });
            }

            // Clear cookies
            res.clearCookie('accessToken', {
                domain: 'localhost',
                path: '/',
            });
            res.clearCookie('refreshToken', {
                domain: 'localhost',
                path: '/',
            });

            res.json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    };
}

/*
  uploadGallery = async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) {
                return next(
                    createHttpError(400, 'Please upload at least one file')
                );
            }

            // Access multiple files
            const files = req.files;
            // Process files...

            res.json({
                message: 'Gallery uploaded successfully',
                files: files.map((f) => f.filename),
            });
        } catch (error) {
            next(error);
        }
    };
*/
