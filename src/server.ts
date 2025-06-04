import app from './app';

const PORT = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Running in ${env} mode`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});