import { logger } from '../config/logger.js';
import { v4 as uuidv4 } from 'uuid';

export const globalErrorHandler = (error, req, res, next) => {
    const errorId = uuidv4();
    const statusCode = error.status || 500;
    const isProduction = process.env.NODE_ENV === 'prod';
    const message = isProduction ? 'Internal server Error' : error.message;

    logger.error(error.message, {
        id: errorId,
        statusCode,
        path: req.path,
        method: req.method,
        error: error.stack,
    });

    res.status(statusCode).json({
        errors: [
            {
                ref: errorId,
                type: error.name,
                message: message,
                path: req.path,
                method: req.method,
                location: 'server',
                stack: isProduction ? null : error.stack,
            },
        ],
    });
};
