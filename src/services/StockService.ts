import StockModel from "../models/stock.model";
import { ApiError } from "../exceptions/ApiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateStockOwnership } from "../validators/StockValidator";
import { StockData, StockRequest, StockResponse, JenisTransaksi } from "../types/stock.type";

/**
 * Service untuk mendapatkan semua transaksi stok berdasarkan userId
 */
export const getStocksService = async (userId: string): Promise<StockData[]> => {
    await validateUserExists(userId);

    const stocks = await StockModel.findStockTransactionByUserId(userId);

    const formattedStocks = stocks.map(stock => ({
        ...stock,
        createdAt: stock.createdAt ? new Date(stock.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) : undefined,
        updatedAt: stock.updatedAt ? new Date(stock.updatedAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) : undefined
    })) as StockData[];

    return formattedStocks;
};

/**
 * Service untuk mendapatkan detail stok spesifik
 */
export const getStockDetailService = async (
    userId: string,
    stockId: string
): Promise<StockData> => {
    await validateUserExists(userId);

    const stockDetail = await StockModel.findStockTransactionByIdAndUserId(userId, stockId);

    if (!stockDetail) {
        throw new ApiError("Stok tidak ditemukan", 404);
    }

    const formattedStockDetail = {
        ...stockDetail,
        createdAt: stockDetail.createdAt ? new Date(stockDetail.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) : undefined,
        updatedAt: stockDetail.updatedAt ? new Date(stockDetail.updatedAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) : undefined
    };

    return formattedStockDetail;
};

/**
 * Service untuk memperbarui transaksi stok
 * Mengimplementasikan logika bisnis untuk perhitungan stok
 */
export const updateStockService = async (
    userId: string,
    stockId: string,
    data: Partial<StockRequest>
): Promise<StockResponse> => {
    await validateUserExists(userId);
    await validateStockOwnership(userId, stockId);

    const existingStock = await StockModel.findStockTransactionByIdAndUserId(userId, stockId);
    if (!existingStock) {
        throw new ApiError("Stok tidak ditemukan", 404);
    }

    let updatedData: Partial<StockRequest> = { ...data };

    if (data.jumlah !== undefined && data.jenis_transaksi !== undefined) {
        let newJumlah = existingStock.jumlah;

        if (data.jenis_transaksi === JenisTransaksi.KELUAR) {
            newJumlah -= data.jumlah;
            if (newJumlah < 0) {
                throw new ApiError(
                    `Jumlah tidak cukup. Stok ${existingStock.nama_bahan} saat ini adalah ${existingStock.jumlah}`,
                    400
                );
            }
        } else if (data.jenis_transaksi === JenisTransaksi.MASUK) {
            newJumlah += data.jumlah;
        } else if (data.jenis_transaksi === 'Penyesuaian') {
            newJumlah = data.jumlah;
        }

        updatedData.jumlah = newJumlah;
    }

    await StockModel.updateStockTransaction(stockId, updatedData);

    return {
        message: "Stok berhasil diperbarui",
    };
};

/**
 * Service untuk menghapus transaksi stok
 */
export const deleteStockService = async (
    userId: string,
    stockId: string
): Promise<StockResponse> => {
    await validateUserExists(userId);
    await validateStockOwnership(userId, stockId);

    try {
        await StockModel.deleteStockTransaction(stockId);

        return {
            message: "Stok berhasil dihapus",
        };
    } catch (error) {
        throw new ApiError("Gagal menghapus stok", 400);
    }
};