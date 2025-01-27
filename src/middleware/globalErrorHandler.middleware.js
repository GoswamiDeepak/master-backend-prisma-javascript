export const globalErrorHandler = (error,req,res,next) => {
    const statusCode = error.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    const message = isProduction ? 'Internal server Error' : error.message;

    res.status(statusCode).json({
        errors: [
            {
                type: error.name,
                message: message,
                path: req.path,
                method: req.method,
                localtion: 'server',
                stack: isProduction ? null : error.stack
            }
        ]
    })
}