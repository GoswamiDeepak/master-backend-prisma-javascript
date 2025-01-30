import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import prisma from '../../DB/db.config.js';

export class TokenService {
    generateAccessToken(payload) {
        const accessToken = jwt.sign(payload, config.secretKey, {
            algorithm: 'HS256',
            expiresIn: '10m',
            issuer: 'master-backend',
        });
        return accessToken;
    }
    generateRefreshToken(payload) {
        const refreshToken = jwt.sign(payload, config.refreshKey, {
            algorithm: 'HS256',
            expiresIn: '15m',
            issuer: 'master-backend',
            jwtid: String(payload.id),
        });
        return refreshToken;
    }

    async persistRefreshToken(user) {
        try {
            // First, delete any existing refresh token for this user
            await prisma.refreshTokens.deleteMany({
                where: {
                    userId: user.id,
                },
            });

            // Then create a new refresh token
            return await prisma.refreshTokens.create({
                data: {
                    userId: user.id,
                    expireAt: new Date(
                        Date.now() +
                            1000 *
                                60 *
                                60 *
                                24 *
                                (new Date().getFullYear() % 4 === 0 ? 366 : 365)
                    ),
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
