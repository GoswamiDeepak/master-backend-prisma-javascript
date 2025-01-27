import app from './app.js';
import { config } from './config/index.js';
import { logger } from './config/logger.js';

const PORT = config.port;

app.listen(PORT, () => {
    logger.info(`Listening on PORT: ${PORT}`);
});
