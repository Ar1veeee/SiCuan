"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import controller
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const menu_route_1 = __importDefault(require("./routes/menu.route"));
const hpp_route_1 = __importDefault(require("./routes/hpp.route"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const stock_route_1 = __importDefault(require("./routes/stock.route"));
const test_route_1 = __importDefault(require("./routes/test.route"));
// import middlewares
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const hpp_1 = __importDefault(require("hpp"));
const xss_1 = __importDefault(require("xss"));
const Logger_1 = __importDefault(require("./config/Logger"));
const app = (0, express_1.default)();
const morganFormat = ":method :url :status :response-time ms";
const limitter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
});
const authLimitter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 50
});
app.use(limitter);
app.use((0, hpp_1.default)());
app.use((req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = (0, xss_1.default)(req.body[key]);
            }
        }
    }
    next();
});
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            };
            Logger_1.default.info(JSON.stringify(logObject));
        },
    },
}));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "trusted-cdn.com"],
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginResourcePolicy: { policy: "same-origin" },
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use("/auth", authLimitter, auth_route_1.default);
app.use("/profile", profile_route_1.default);
app.use("/menu", menu_route_1.default);
app.use("/resep", hpp_route_1.default);
app.use("/stock", stock_route_1.default);
app.use("/test", test_route_1.default);
exports.default = app;
