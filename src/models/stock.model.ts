import { PrismaClient } from "@prisma/client";
import { ApiError } from "../exceptions/apiError";
import { StockData, StockRequest, JenisTransaksi } from "../types/stock.type";

const prisma = new PrismaClient();

// Type adapter function to convert Prisma result to StockData
const toDomainModel = (prismaStock: any): StockData => {
    return {
        id: prismaStock.id,
        userId: prismaStock.userId,
        nama: prismaStock.nama,
        jumlah: prismaStock.jumlah,
        jenis_transaksi: prismaStock.jenis_transaksi as JenisTransaksi,
        keterangan: prismaStock.keterangan ?? '',
        tanggal: prismaStock.tanggal
    };
};

const StockModel = {
    /**
     * Membuat transaksi stok baru
     */
    createStockTransaction: async (
        userId: number,
        data: StockRequest
    ): Promise<StockData> => {
        const result = await prisma.stockTransaction.create({
            data: {
                userId,
                nama: data.nama,
                jumlah: data.jumlah,
                jenis_transaksi: data.jenis_transaksi,
                keterangan: data.keterangan,
            },
        });
        return toDomainModel(result);
    },

    /**
     * Mencari semua transaksi stok berdasarkan userId
     */
    findStockTransactionByUserId: async (userId: number): Promise<StockData[]> => {
        const results = await prisma.stockTransaction.findMany({
            where: { userId }
        });
        return results.map(toDomainModel);
    },

    /**
     * Mencari transaksi stok berdasarkan id dan userId
     */
    findStockTransactionByIdAndUserId: async (
        userId: number,
        stockTransactionId: number
    ): Promise<StockData | null> => {
        const result = await prisma.stockTransaction.findFirst({
            where: {
                userId,
                id: stockTransactionId
            }
        });
        return result ? toDomainModel(result) : null;
    },

    /**
     * Mencari transaksi stok berdasarkan nama dan userId
     */
    findExistingStockTransaction: async (
        userId: number,
        nama: string
    ): Promise<StockData | null> => {
        const result = await prisma.stockTransaction.findFirst({
            where: { userId, nama }
        });
        return result ? toDomainModel(result) : null;
    },

    /**
     * Memperbarui transaksi stok
     */
    updateStockTransaction: async (
        stockId: number,
        data: Partial<StockRequest>
    ): Promise<StockData> => {
        const result = await prisma.stockTransaction.update({
            where: { id: stockId },
            data
        });
        return toDomainModel(result);
    },

    /**
     * Menghapus transaksi stok
     */
    deleteStockTransaction: async (
        stockId: number
    ): Promise<StockData> => {
        const result = await prisma.stockTransaction.delete({
            where: { id: stockId }
        });
        return toDomainModel(result);
    }
};

export default StockModel;