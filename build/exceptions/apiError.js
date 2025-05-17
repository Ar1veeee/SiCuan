"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static badRequest(message) {
        return new ApiError(message, 400);
    }
    static unauthorized(message) {
        return new ApiError(message, 401);
    }
    static forbidden(message) {
        return new ApiError(message, 403);
    }
    static notFound(message) {
        return new ApiError(message, 404);
    }
    static internal(message) {
        return new ApiError(message, 500);
    }
}
exports.ApiError = ApiError;
