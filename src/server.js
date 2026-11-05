import 'dotenv/config';
import { createApp } from './app.js';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const server = createApp().listen(port, () => {
  console.info(`Connect orchestration service listening on port ${port}.`);
});

function shutdown(signal) {
  console.info(`${signal} received; shutting down.`);
  server.close((error) => {
    if (error) {
      console.error('Error while shutting down:', error);
      process.exitCode = 1;
    }
  });

  const forceShutdown = setTimeout(() => {
    console.error('Graceful shutdown timed out; forcing exit.');
    process.exit(1);
  }, 10_000);
  forceShutdown.unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
