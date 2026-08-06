import app from './app.js';
import config from './config/index.js';
import { logger } from './utils/logger.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 ascess-1-ai backend server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});
