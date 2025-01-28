import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const auth = async (req, _, next) => {
    try {
        const accessToken =
            req.cookies.accessToken ||
            req.headers.authorization?.replace('Bearer ', '');
        if (!accessToken) {
            return next(createHttpError(403, 'Invalid access!'));
        }
        const isUser = jwt.verify(accessToken, config.secretKey);
        if (!isUser) {
            return next(createHttpError(401, 'Token expired!.'));
        }
        const user = {
            id: isUser.id,
            email: isUser.email,
            name: isUser.name,
            profile: isUser.profile,
        };
        req.user = user;
        next();
    } catch (error) {
        next(createHttpError(401, error));
    }
};

export default auth;
