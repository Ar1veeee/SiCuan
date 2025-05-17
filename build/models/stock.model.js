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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Type adapter function to convert Prisma result to StockData
const toDomainModel = (prismaStock) => {
    var _a;
    return {
        id: prismaStock.id,
        userId: prismaStock.userId,
        nama: prismaStock.nama,
        jumlah: prismaStock.jumlah,
        jenis_transaksi: prismaStock.jenis_transaksi,
        keterangan: (_a = prismaStock.keterangan) !== null && _a !== void 0 ? _a : '',
        tanggal: prismaStock.tanggal
    };
};
const StockModel = {
    /**
     * Membuat transaksi stok baru
     */
    createStockTransaction: (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma.stockTransaction.create({
            data: {
                userId,
                nama: data.nama,
                jumlah: data.jumlah,
                jenis_transaksi: data.jenis_transaksi,
                keterangan: data.keterangan,
            },
        });
        return toDomainModel(result);
    }),
    /**
     * Mencari semua transaksi stok berdasarkan userId
     */
    findStockTransactionByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield prisma.stockTransaction.findMany({
            where: { userId }
        });
        return results.map(toDomainModel);
    }),
    /**
     * Mencari transaksi stok berdasarkan id dan userId
     */
    findStockTransactionByIdAndUserId: (userId, stockTransactionId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma.stockTransaction.findFirst({
            where: {
                userId,
                id: stockTransactionId
            }
        });
        return result ? toDomainModel(result) : null;
    }),
    /**
     * Mencari transaksi stok berdasarkan nama dan userId
     */
    findExistingStockTransaction: (userId, nama) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma.stockTransaction.findFirst({
            where: { userId, nama }
        });
        return result ? toDomainModel(result) : null;
    }),
    /**
     * Memperbarui transaksi stok
     */
    updateStockTransaction: (stockId, data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma.stockTransaction.update({
            where: { id: stockId },
            data
        });
        return toDomainModel(result);
    }),
    /**
     * Menghapus transaksi stok
     */
    deleteStockTransaction: (stockId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma.stockTransaction.delete({
            where: { id: stockId }
        });
        return toDomainModel(result);
    })
};
exports.default = StockModel;
