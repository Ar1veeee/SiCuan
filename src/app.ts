import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
import hpp from "hpp"
import xss from "xss-clean"
import logger from "./config/logger.config";
import DatabaseService from './config/database.config';

// Import routes
import AuthRoutes from "./routes/auth.route"
import MenuRoutes from "./routes/menu.route"
import HppRoutes from "./routes/hpp.route"
import ProfileRoutes from "./routes/profile.route"
import StockRoutes from "./routes/stock.route"
import SalesRoutes from "./routes/sales.route"
import DashboardRoutes from "./routes/dashboard.route"

// Import middlewares
import { errorHandler } from "./middlewares/errorHandler.middleware"

const app = express()

// Rate limiting configurations
const limitter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
})

const authLimitter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50, 
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
})

// Apply middlewares
app.use(limitter)
app.use(hpp())
app.use(express.json({ limit: '1mb' })) // Batasi payload
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())
app.use(xss()) // Terapkan sanitasi XSS
app.use(compression())
app.use(helmet()) 

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan((tokens, req, res) => {
        const logObject = {
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: tokens.status(req, res),
            responseTime: `${tokens['response-time'](req, res)} ms`,
        };
        logger.info(JSON.stringify(logObject));
        return null; 
    }));
}

// Routes
app.use("/auth", authLimitter, AuthRoutes)
app.use("/profiles", ProfileRoutes)
app.use("/menus", MenuRoutes)
app.use("/recipes", HppRoutes)
app.use("/stocks", StockRoutes)
app.use("/sales", SalesRoutes)
app.use("/dashboard", DashboardRoutes)

// Fixed health check endpoint
app.get('/health', async (req, res) => {
    const startTime = Date.now();
    try {
        const databaseHealthy = await DatabaseService.healthCheck();
        const memoryUsage = process.memoryUsage();
        
        const memoryHealthy = memoryUsage.rss < 500 * 1024 * 1024;
        const heapHealthy = memoryUsage.heapUsed < 100 * 1024 * 1024;
        
        const isHealthy = databaseHealthy && memoryHealthy && heapHealthy;
        const responseTime = Date.now() - startTime;

        const healthData = {
            status: isHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            version: process.env.npm_package_version || '1.0.0',
            pid: process.pid,
            runtime: {
                name: 'bun',
                version: Bun.version,
                platform: process.platform,
                arch: process.arch,
            },
            responseTime: `${responseTime}ms`,
            services: {
                database: {
                    status: databaseHealthy ? 'healthy' : 'unhealthy',
                    connected: DatabaseService.isReady(),
                    info: DatabaseService.isReady()
                },
                memory: {
                    status: (memoryHealthy && heapHealthy) ? 'healthy' : 'unhealthy',
                    usage: {
                        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
                        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                        heapUsedPercent: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`
                    },
                    thresholds: {
                        heapLimit: '100MB',
                        rssLimit: '500MB'
                    }
                }
            }
        };

        const statusCode = isHealthy ? 200 : 503;
        res.status(statusCode).json(healthData);
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            responseTime: `${Date.now() - startTime}ms`,
            runtime: 'bun'
        });
    }
});

// Readiness check endpoint
app.get('/ready', async (req, res) => {
    try {
        const databaseReady = await DatabaseService.healthCheck();

        if (databaseReady) {
            res.status(200).json({
                status: 'ready',
                timestamp: new Date().toISOString(),
                message: 'Application is ready to serve requests',
                runtime: 'bun'
            });
        } else {
            res.status(503).json({
                status: 'not ready',
                timestamp: new Date().toISOString(),
                message: 'Application is not ready to serve requests',
                runtime: 'bun'
            });
        }
    } catch (error) {
        logger.error('Ready check failed:', error);
        res.status(503).json({
            status: 'not ready',
            timestamp: new Date().toISOString(),
            error: 'Ready check failed',
            runtime: 'bun'
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statusCode: 404,
        runtime: 'bun'
    });
});

app.use(errorHandler)

export default app