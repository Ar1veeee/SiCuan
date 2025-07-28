import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import xss from "xss-clean";
import logger from "./config/logger.config";
import DatabaseService from "./config/database.config";

// Import routes
import AuthRoutes from "./routes/auth.route";
import MenuRoutes from "./routes/menu.route";
import HppRoutes from "./routes/recipe.route";
import ProfileRoutes from "./routes/profile.route";
import StockRoutes from "./routes/stock.route";
import SalesRoutes from "./routes/sales.route";
import DashboardRoutes from "./routes/dashboard.route";

// Import middlewares
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

// Memory monitoring
let memoryMonitor: NodeJS.Timeout | null = null;

// Rate limiting configurations
const limitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply middlewares
app.use(limitter);
app.use(hpp());
app.use(xss());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan((tokens, req, res) => {
      const logObject = {
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        contentLength: tokens.res(req, res, "content-length"),
        responseTime: `${tokens["response-time"](req, res)} ms`,
      };
      logger.info(JSON.stringify(logObject));
      return null;
    })
  );
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(compression());

app.use(
  express.json({
    limit: "1mb",
    strict: true,
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
    parameterLimit: 1000,
  })
);

// Routes
app.use(`/auth`, authLimitter, AuthRoutes);
app.use(`/profiles`, ProfileRoutes);
app.use(`/menus`, MenuRoutes);
app.use(`/recipes`, HppRoutes);
app.use(`/stocks`, StockRoutes);
app.use(`/sales`, SalesRoutes);
app.use(`/dashboard`, DashboardRoutes);

let healthCheckCache: {
  data: any;
  statusCode: number;
  timestamp: number;
} | null = null;

const HEALTH_CHECK_CACHE_TTL = 30000;

app.get("/health", async (req: Request, res: Response) => {
  const startTime = Date.now();
  const now = Date.now();

  try {
    if (
      healthCheckCache &&
      now - healthCheckCache.timestamp < HEALTH_CHECK_CACHE_TTL
    ) {
      const responseTime = Date.now() - startTime;
      res.status(healthCheckCache.statusCode).json({
        ...healthCheckCache.data,
        responseTime: `${responseTime}ms`,
        cached: true,
      });
      return;
    }

    const databaseHealthy = await Promise.race([
      DatabaseService.healthCheck(),
      new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error("Health check timeout")), 5000)
      ),
    ]);

    const memoryUsage = process.memoryUsage();

    const memoryHealthy = memoryUsage.rss < 500 * 1024 * 1024;
    const heapHealthy = memoryUsage.heapUsed < 150 * 1024 * 1024;

    const isHealthy = databaseHealthy && memoryHealthy && heapHealthy;
    const responseTime = Date.now() - startTime;

    const healthData = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
      pid: process.pid,
      runtime: {
        name: "bun",
        version: (global as any).Bun?.version || process.version,
        platform: process.platform,
        arch: process.arch,
      },
      responseTime: `${responseTime}ms`,
      services: {
        database: {
          status: databaseHealthy ? "healthy" : "unhealthy",
          connected: DatabaseService.isReady(),
        },
        memory: {
          status: memoryHealthy && heapHealthy ? "healthy" : "unhealthy",
          usage: {
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
            heapUsedPercent: `${Math.round(
              (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
            )}%`,
          },
          thresholds: {
            heapLimit: "150MB",
            rssLimit: "500MB",
          },
        },
      },
    };

    const statusCode = isHealthy ? 200 : 503;

    healthCheckCache = {
      data: healthData,
      statusCode,
      timestamp: now,
    };

    res.status(statusCode).json(healthData);
  } catch (error) {
    healthCheckCache = null;
    logger.error("Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
      responseTime: `${Date.now() - startTime}ms`,
    });
  }
});

let readinessCache: {
  data: any;
  statusCode: number;
  timestamp: number;
} | null = null;

app.get("/ready", async (req: Request, res: Response) => {
  const now = Date.now();

  try {
    if (
      readinessCache &&
      now - readinessCache.timestamp < HEALTH_CHECK_CACHE_TTL
    ) {
      res.status(readinessCache.statusCode).json({
        ...readinessCache.data,
        cached: true,
      });
      return;
    }

    const databaseReady = await Promise.race([
      DatabaseService.healthCheck(),
      new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error("Readiness check timeout")), 3000)
      ),
    ]);

    const statusCode = databaseReady ? 200 : 503;
    const responseData = {
      status: databaseReady ? "ready" : "not ready",
      timestamp: new Date().toISOString(),
      message: databaseReady
        ? "Application is ready to serve requests"
        : "Application is not ready to serve requests",
    };

    readinessCache = {
      data: responseData,
      statusCode,
      timestamp: now,
    };

    res.status(statusCode).json(responseData);
  } catch (error) {
    readinessCache = null;
    logger.error("Ready check failed:", error);
    res.status(503).json({
      status: "not ready",
      timestamp: new Date().toISOString(),
      error: "Ready check failed",
    });
  }
});

const startMemoryMonitoring = () => {
  if (memoryMonitor) return;

  memoryMonitor = setInterval(() => {
    const usage = process.memoryUsage();
    const rssMB = usage.rss / 1024 / 1024;
    const heapUsedMB = usage.heapUsed / 1024 / 1024;

    if (rssMB > 400 || heapUsedMB > 120) {
      logger.warn("High memory usage detected:", {
        rss: `${Math.round(rssMB)}MB`,
        heapUsed: `${Math.round(heapUsedMB)}MB`,
      });

      healthCheckCache = null;
      readinessCache = null;

      if (global.gc) {
        global.gc();
        logger.info("Garbage collection triggered");
      }
    }
  }, 60000);
};

const cleanup = () => {
  if (memoryMonitor) {
    clearInterval(memoryMonitor);
    memoryMonitor = null;
  }

  healthCheckCache = null;
  readinessCache = null;

  logger.info("Application cleanup completed");
};

startMemoryMonitoring();

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    statusCode: 404,
  });
});

app.use(errorHandler);

export default app;
