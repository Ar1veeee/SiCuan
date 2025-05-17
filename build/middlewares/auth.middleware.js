"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
const apiResponse_util_1 = require("../utils/apiResponse.util");
dotenv_safe_1.default.config();
// Token middleware
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            apiResponse_util_1.apiResponse.unauthorized(res, "Authorization header tidak ditemukan");
            return;
        }
        const tokenParts = authHeader.split(",");
        const lastTokenPart = tokenParts[tokenParts.length - 1].trim();
        const token = lastTokenPart.replace(/^Bearer\s+/i, '');
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "string") {
            apiResponse_util_1.apiResponse.forbidden(res, "Format token tidak valid");
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        apiResponse_util_1.apiResponse.error(res, "Token tidak valid", 403, {
            type: error.name,
            detail: error.message,
        });
        return;
    }
};
exports.default = verifyToken;
