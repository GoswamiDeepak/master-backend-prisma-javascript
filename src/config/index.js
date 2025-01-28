import dotenv from 'dotenv';

// Load environment variables from .env.dev
dotenv.config({ path: '.env.dev' });

export const config = {
    port: process.env.PORT || 5500,
    databaseUrl: process.env.DATABASE_URL,
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    secretKey: process.env.PRIVATE_KEY,
    refreshKey: process.env.REFRESH_KEY,
    // other config values...
};
