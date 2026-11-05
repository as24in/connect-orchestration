import express from 'express';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on('finish', () => {
      console.info(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - startedAt}ms`);
    });
    next();
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/v1', (_req, res) => {
    res.status(200).json({ message: 'Connect orchestration API is running.' });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: { message: 'Route not found.' } });
  });

  app.use((error, _req, res, _next) => {
    const status = error.status ?? error.statusCode ?? 500;
    if (status >= 500) console.error(error);
    res.status(status).json({
      error: { message: status >= 500 ? 'Internal server error.' : error.message },
    });
  });

  return app;
}
