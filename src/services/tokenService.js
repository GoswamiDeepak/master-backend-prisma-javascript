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
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; //1y
        const expiry = new Date(Date.now() + MS_IN_YEAR);

        return await prisma.refreshTokens.create({
            data: {
                userId: user.id,
                expireAt: expiry,
                // isRevoked: false
            },
        });
    }
}
