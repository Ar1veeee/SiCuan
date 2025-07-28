import app from "./app";
import DatabaseService from "./config/database.config";
import logger from "./config/logger.config";
import { Server } from "http";

const PORT = Number(process.env.PORT) || 8080;
const env = process.env.NODE_ENV || "development";

const serverOptions = {
  port: PORT,
  hostname: process.env.HOST || "localhost",
  development: env === "development",
};

const server: Server = app.listen(PORT, () => {
  logger.info(`🚀 Running in ${env} mode with Bun ${Bun.version}`);
  logger.info(`🌐 Server running on port ${PORT}`);
  logger.info(`💚 Health check: http://localhost:${PORT}/health`);
  logger.info(`⚡ Runtime: Bun (${process.platform})`);
});

DatabaseService.getInstance();

async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);

  const forceShutdownTimeout = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 30000);

  try {
    server.close(async (err) => {
      if (err) {
        logger.error("Error closing HTTP server:", err);
        clearTimeout(forceShutdownTimeout);
        process.exit(1);
      }

      logger.info("HTTP server closed - no longer accepting new connections");

      try {
        await DatabaseService.disconnect();
        logger.info("Database connections closed successfully");

        clearTimeout(forceShutdownTimeout);
        logger.info("✅ Graceful shutdown completed successfully");
        process.exit(0);
      } catch (cleanupError) {
        logger.error("Error during cleanup:", cleanupError);
        clearTimeout(forceShutdownTimeout);
        process.exit(1);
      }
    });

    if (server.closeAllConnections) {
      server.closeAllConnections();
    }
  } catch (error) {
    logger.error("Error during graceful shutdown:", error);
    clearTimeout(forceShutdownTimeout);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  logger.info("Received SIGINT (Ctrl+C)");
  gracefulShutdown("SIGINT");
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM (process termination)");
  gracefulShutdown("SIGTERM");
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});

process.on("SIGQUIT", () => {
  logger.info("Received SIGQUIT");
  gracefulShutdown("SIGQUIT");
});

logger.info(`🎯 Process started with PID: ${process.pid}`);
logger.info(`⚡ Bun version: ${Bun.version}`);
logger.info(`🛡️  Graceful shutdown handlers registered`);

export default server;
