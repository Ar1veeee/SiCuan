"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStockError = exports.verifyStockOwnership = exports.validateStockId = exports.validateUserId = void 0;
const apiResponse_util_1 = require("../utils/apiResponse.util");
const stock_model_1 = __importDefault(require("../models/stock.model"));
const UserValidator_1 = require("../validators/UserValidator");
const StockValidator_1 = require("../validators/StockValidator");
const apiError_1 = require("../exceptions/apiError");
const validateUserId = (req, res, next) => {
    const { user_id } = req.params;
    if (!user_id) {
        apiResponse_util_1.apiResponse.badRequest(res, "User ID diperlukan");
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        if (isNaN(userId)) {
            apiResponse_util_1.apiResponse.badRequest(res, "User ID harus berupa angka");
            return;
        }
        req.userId = userId;
        next();
    }
    catch (error) {
        apiResponse_util_1.apiResponse.badRequest(res, "Format User ID tidak valid");
    }
};
exports.validateUserId = validateUserId;
const validateStockId = (req, res, next) => {
    const { stock_id } = req.params;
    if (!stock_id) {
        apiResponse_util_1.apiResponse.badRequest(res, "Stock ID diperlukan");
        return;
    }
    try {
        const stockId = parseInt(stock_id, 10);
        if (isNaN(stockId)) {
            apiResponse_util_1.apiResponse.badRequest(res, "Stock ID harus berupa angka");
            return;
        }
        req.stockId = stockId;
        next();
    }
    catch (error) {
        apiResponse_util_1.apiResponse.badRequest(res, "Format Stock ID tidak valid");
    }
};
exports.validateStockId = validateStockId;
const verifyStockOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.userId || !req.stockId) {
            apiResponse_util_1.apiResponse.badRequest(res, "User ID dan Stock ID diperlukan");
            return;
        }
        yield (0, UserValidator_1.validateUserExists)(req.userId);
        yield (0, StockValidator_1.validateStockOwnership)(req.userId, req.stockId);
        // Tambahkan data stock ke request untuk digunakan di controller
        const rawStockData = yield stock_model_1.default.findStockTransactionByIdAndUserId(req.userId, req.stockId);
        if (!rawStockData) {
            throw new apiError_1.ApiError("Stock tidak ditemukan", 404);
        }
        // Convert string jenis_transaksi to JenisTransaksi type and handle null keterangan
        const stockData = Object.assign(Object.assign({}, rawStockData), { jenis_transaksi: rawStockData.jenis_transaksi, keterangan: (_a = rawStockData.keterangan) !== null && _a !== void 0 ? _a : '' // Convert null to empty string
         });
        req.stockData = stockData;
        next();
    }
    catch (error) {
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan saat verifikasi kepemilikan stock");
        }
    }
});
exports.verifyStockOwnership = verifyStockOwnership;
/**
 * Handler error global untuk controller stock
 */
const handleStockError = (error, res) => {
    // Untuk production, gunakan logger yang proper seperti Winston atau Pino
    console.error("[Stock Error]:", error);
    if (error instanceof apiError_1.ApiError) {
        apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
    }
    else {
        apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
    }
};
exports.handleStockError = handleStockError;
