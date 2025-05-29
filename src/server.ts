import app from './app';

if (process.env.NODE_ENV === 'production') {
  import('dotenv').then(dotenv => {
    dotenv.config();
    startServer();
  });
} else {
  import('dotenv-safe').then(dotenvSafe => {
    dotenvSafe.config();
    startServer();
  });
}

function startServer() {
  const PORT = process.env.PORT || 8080;

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}