import createHttpError from 'http-errors';

export const asyncWrapper = (requestHandlerFn) => {
    return (req, res, next) => {
        Promise.resolve(requestHandlerFn(req, res, next)).catch((error) => {
            if (error instanceof Error) {
                return next(createHttpError(500, error.message));
            }
            return next(createHttpError(500, 'Failed to operate'));
        });
    };
};
