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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStock = exports.updateStock = exports.getStocks = exports.createStock = void 0;
const apiResponse_util_1 = require("../utils/apiResponse.util");
const StockService_1 = require("../services/StockService");
const stock_middleware_1 = require("../middlewares/stock.middleware");
/**
 * Controller untuk membuat transaksi stok baru
 */
const createStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, StockService_1.createStockService)(req.userId, req.body);
        apiResponse_util_1.apiResponse.created(res, result);
    }
    catch (error) {
        (0, stock_middleware_1.handleStockError)(error, res);
    }
});
exports.createStock = createStock;
/**
 * Controller untuk mendapatkan semua transaksi stok user
 */
const getStocks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stocks = yield (0, StockService_1.getStocksService)(req.userId);
        apiResponse_util_1.apiResponse.success(res, { stocks });
    }
    catch (error) {
        (0, stock_middleware_1.handleStockError)(error, res);
    }
});
exports.getStocks = getStocks;
/**
 * Controller untuk memperbarui transaksi stok
 */
const updateStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, StockService_1.updateStockService)(req.userId, req.stockId, req.body);
        apiResponse_util_1.apiResponse.success(res, result);
    }
    catch (error) {
        (0, stock_middleware_1.handleStockError)(error, res);
    }
});
exports.updateStock = updateStock;
/**
 * Controller untuk menghapus transaksi stok
 */
const deleteStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, StockService_1.deleteStockService)(req.userId, req.stockId);
        apiResponse_util_1.apiResponse.success(res, result);
    }
    catch (error) {
        (0, stock_middleware_1.handleStockError)(error, res);
    }
});
exports.deleteStock = deleteStock;
