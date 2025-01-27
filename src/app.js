import express from 'express';
import { config } from './config/index.js';
import authRouter from './routes/auth.router.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get(`${config.apiPrefix}/healthcheck`, (_, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
    });
});

// Routes
app.use(`${config.apiPrefix}/auth`, authRouter);

export default app;
