import express from 'express';
import { config } from './config/index.js';
import authRouter from './routes/auth.router.js';
import { globalErrorHandler } from './middleware/globalErrorHandler.middleware.js';

const app = express();

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// Health check route
app.get(`/`, (req, res) => {
    res.json({ message: 'Welcome to master-backend' });
});

// Routes
app.use(`${config.apiPrefix}/auth`, authRouter);

app.use(globalErrorHandler);

export default app;
