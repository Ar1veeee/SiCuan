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
exports.deleteStockService = exports.updateStockService = exports.getStocksService = exports.createStockService = void 0;
// services/stockService.ts
const stock_model_1 = __importDefault(require("../models/stock.model"));
const apiError_1 = require("../exceptions/apiError");
const UserValidator_1 = require("../validators/UserValidator");
const StockValidator_1 = require("../validators/StockValidator");
const stock_type_1 = require("../types/stock.type");
/**
 * Service untuk membuat transaksi stok baru
 */
const createStockService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    if (!data.nama || !data.jumlah || !data.jenis_transaksi) {
        throw new apiError_1.ApiError("Data stok tidak lengkap", 400);
    }
    const existingStock = yield stock_model_1.default.findExistingStockTransaction(userId, data.nama);
    if (existingStock) {
        throw new apiError_1.ApiError("Stok dengan nama tersebut sudah tersedia", 400);
    }
    const createdStock = yield stock_model_1.default.createStockTransaction(userId, data);
    return {
        message: "Stok berhasil ditambahkan",
        data: createdStock
    };
});
exports.createStockService = createStockService;
/**
 * Service untuk mendapatkan semua transaksi stok berdasarkan userId
 */
const getStocksService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    const stocks = yield stock_model_1.default.findStockTransactionByUserId(userId);
    return stocks.map(stock => (Object.assign(Object.assign({}, stock), { tanggal: stock.tanggal ? new Date(stock.tanggal).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) : undefined })));
});
exports.getStocksService = getStocksService;
/**
 * Service untuk memperbarui transaksi stok
 * Mengimplementasikan logika bisnis untuk perhitungan stok
 */
const updateStockService = (userId, stockId, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    yield (0, StockValidator_1.validateStockOwnership)(userId, stockId);
    const existingStock = yield stock_model_1.default.findStockTransactionByIdAndUserId(userId, stockId);
    if (!existingStock) {
        throw new apiError_1.ApiError("Stok tidak ditemukan", 404);
    }
    let updatedData = Object.assign({}, data);
    if (data.jumlah !== undefined && data.jenis_transaksi !== undefined) {
        let newJumlah = existingStock.jumlah;
        if (data.jenis_transaksi === stock_type_1.JenisTransaksi.KELUAR) {
            newJumlah -= data.jumlah;
            if (newJumlah < 0) {
                throw new apiError_1.ApiError(`Jumlah tidak cukup. Stok ${existingStock.nama} saat ini adalah ${existingStock.jumlah}`, 400);
            }
        }
        else if (data.jenis_transaksi === stock_type_1.JenisTransaksi.MASUK) {
            newJumlah += data.jumlah;
        }
        else if (data.jenis_transaksi === 'Penyesuaian') {
            newJumlah = data.jumlah;
        }
        updatedData.jumlah = newJumlah;
    }
    const updatedStock = yield stock_model_1.default.updateStockTransaction(stockId, updatedData);
    return {
        message: "Stok berhasil diperbarui",
        data: updatedStock
    };
});
exports.updateStockService = updateStockService;
/**
 * Service untuk menghapus transaksi stok
 */
const deleteStockService = (userId, stockId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    yield (0, StockValidator_1.validateStockOwnership)(userId, stockId);
    try {
        const deletedStock = yield stock_model_1.default.deleteStockTransaction(stockId);
        return {
            message: "Stok berhasil dihapus",
            data: deletedStock
        };
    }
    catch (error) {
        throw new apiError_1.ApiError("Gagal menghapus stok", 400);
    }
});
exports.deleteStockService = deleteStockService;
