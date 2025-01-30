import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import authRouter from './routes/auth.router.js';
import newRouter from './routes/news.router.js';
import { globalErrorHandler } from './middleware/globalErrorHandler.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: ['*'],
        credentials: true,
    })
);

// Health check route
app.get(`/`, (req, res) => {
    res.json({ message: 'Welcome to master-backend' });
});

// Routes
app.use(`${config.apiPrefix}/auth`, authRouter);
app.use(`${config.apiPrefix}/news`, newRouter);

app.use(globalErrorHandler);

export default app;
