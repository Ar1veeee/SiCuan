import { PrismaClient } from "@prisma/client";
import { StockData, StockRequest, JenisTransaksi } from "../types/stock.type";

const prisma = new PrismaClient();

const toDomainModel = (prismaStock: any): StockData => {
    return {
        id: prismaStock.id,
        userId: prismaStock.userId,
        bahanId: prismaStock.bahanId,
        nama_bahan: prismaStock.nama_bahan,
        jumlah: prismaStock.jumlah,
        jenis_transaksi: prismaStock.jenis_transaksi as JenisTransaksi,
        keterangan: prismaStock.keterangan ?? '',
        createdAt: prismaStock.createdAt,
        updatedAt: prismaStock.updatedAt,
    };
};

const StockModel = {
    /**
     * Memperbarui transaksi stok
     */
    updateStockTransaction: async (
        stockId: string,
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
        stockId: string
    ): Promise<StockData> => {
        const result = await prisma.stockTransaction.delete({
            where: { id: stockId }
        });
        return toDomainModel(result);
    },

    /**
     * Mencari semua transaksi stok berdasarkan userId
     */
    findStockTransactionByUserId: async (userId: string): Promise<StockData[]> => {
        const results = await prisma.stockTransaction.findMany({
            where: { userId }
        });
        return results.map(toDomainModel);
    },

    /**
     * Mencari transaksi stok berdasarkan id dan userId
     */
    findStockTransactionByIdAndUserId: async (
        userId: string,
        stockTransactionId: string
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
        userId: string,
        nama_bahan: string
    ): Promise<StockData | null> => {
        const result = await prisma.stockTransaction.findFirst({
            where: { userId, nama_bahan }
        });
        return result ? toDomainModel(result) : null;
    },
};

export default StockModel;