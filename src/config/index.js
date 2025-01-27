import dotenv from 'dotenv';

// Load environment variables from .env.dev
dotenv.config({ path: '.env.dev' });

export const config = {
    port: process.env.PORT || 5500,
    // other config values...
};

console.log(config);
