import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';

export class AuthController {
    async register(req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty(req)) {
            return next(createHttpError(400, result.array()));
        }
        return res.json({ data: req.body });
    }
}
