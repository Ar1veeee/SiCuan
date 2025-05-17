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
exports.stockSchema = exports.validateStockOwnership = void 0;
const stock_model_1 = __importDefault(require("../models/stock.model"));
const apiError_1 = require("../exceptions/apiError");
const zod_1 = require("zod");
const validateStockOwnership = (userId, stockId) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(stockId)) {
        throw new apiError_1.ApiError("Stok ID tidak valid", 400);
    }
    const stock = yield stock_model_1.default.findStockTransactionByIdAndUserId(userId, stockId);
    if (!stock) {
        throw new apiError_1.ApiError("Stok tidak dapat ditemukan", 400);
    }
    return stock;
});
exports.validateStockOwnership = validateStockOwnership;
exports.stockSchema = zod_1.z.object({
    nama: zod_1.z.string().nonempty('Nama stok wajib diisi'),
    jumlah: zod_1.z.number().min(1, 'Jumlah harus lebih dari 0'),
    jenis_transaksi: zod_1.z.string().nonempty('Jenis transaksi stok wajib diisi'),
    keterangan: zod_1.z.string().nonempty('Keterangan stok wajib diisi'),
});
