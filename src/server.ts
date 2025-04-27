import app from './app';
import { Server } from 'http';
import logger from './utils/logger';

let server: Server;

async function main() {
  try {
    server = app.listen(5000, () => {
      logger.info(`App is listening on port 5000`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection detected, shutting down`, { err });
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception detected, shutting down`, { err });
  process.exit(1);
});