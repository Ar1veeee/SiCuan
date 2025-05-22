// import controller
import AuthRoutes from "./routes/auth.route"
import MenuRoutes from "./routes/menu.route"
import HppRoutes from "./routes/hpp.route"
import ProfileRoutes from "./routes/profile.route"
import StockRoutes from "./routes/stock.route"
import TestRoutes from "./routes/test.route"

// import middlewares
import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
import hpp from "hpp"
import xss from "xss"
import logger from "./config/logger.config";
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.config';

const app = express()

app.set('trust proxy', true)

const morganFormat = ":method :url :status :response-time ms";

const limitter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

const authLimitter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
})

app.use(limitter)
app.use(hpp())
app.use((req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        }
    }
    next();
});
app.use(cookieParser())
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "trusted-cdn.com"],
            },
        },
        crossOriginEmbedderPolicy: true,
        crossOriginResourcePolicy: { policy: "same-origin" },
    })
);
app.use(compression())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true }));

app.use("/auth", authLimitter, AuthRoutes)
app.use("/profile", ProfileRoutes)
app.use("/menu", MenuRoutes)
app.use("/resep", HppRoutes)
app.use("/stock", StockRoutes)
app.use("/test", TestRoutes)

export default app
