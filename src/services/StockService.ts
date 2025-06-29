import StockModel from "../models/stock.model";
import { ApiError } from "../exceptions/ApiError";
import { CreateStockTransactionRequest, DefaultStockResponse, StockSummaryResponse } from "../types/stock.type";
import { Bahan } from "@prisma/client";

/**
 * Service untuk mendapatkan semua transaksi stok berdasarkan userId
 * @param userId 
 * @returns 
 */
export const getStocksService = async (userId: string): Promise<StockSummaryResponse[]> => {
    const bahanList = await StockModel.findBahanByUserId(userId);

    return bahanList.map(bahan => ({
        id: bahan.id,
        userId: bahan.userId,
        nama_bahan: bahan.nama_bahan,
        jumlah: bahan.jumlah,
        satuan: bahan.satuan || '',
        minimum_stock: bahan.minimum_stock || 0,
    }));
};

/**
 * Service untuk memperbarui transaksi stok
 * @param userId 
 * @param bahanId 
 * @param data 
 * @returns 
 */
export const createStockTransactionService = async (
    userId: string,
    bahan: Bahan,
    transactionData: CreateStockTransactionRequest
): Promise<DefaultStockResponse> => {
    if (transactionData.jenis_transaksi === 'PENJUALAN') {
        if (bahan.jumlah < transactionData.jumlah) {
            throw new ApiError(`Stok tidak cukup. Stok ${bahan.nama_bahan} saat ini: ${bahan.jumlah}`, 400);
        }
    }

    const existingBahan = await StockModel.findBahanByName(userId, bahan.nama_bahan)

    if (existingBahan) {
        throw new ApiError("Bahan sudah tersedia", 409)
    }

    await StockModel.createTransactionAndUpdateBahan(
        userId,
        bahan.id,
        transactionData
    );

    return { message: "Transaksi stok berhasil dicatat" };
};

// /**
//  * Service untuk menghapus transaksi stok
//  */
// export const deleteStockService = async (
//     userId: string,
//     stockId: string
// ): Promise<DefaultStockResponse> => {
//     await validateUserExists(userId);
//     await validateStockOwnership(userId, stockId);

//     try {
//         await StockModel.deleteStockTransaction(stockId);

//         return {
//             message: "Stok berhasil dihapus",
//         };
//     } catch (error) {
//         throw new ApiError("Gagal menghapus stok", 400);
//     }
// };