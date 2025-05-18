import StockModel from "../models/stock.model";
import { ApiError } from "../exceptions/ApiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateStockOwnership } from "../validators/StockValidator";
import { StockData, StockRequest, StockResponse, JenisTransaksi } from "../types/stock.type";

/**
 * Service untuk membuat transaksi stok baru
 */
export const createStockService = async (
    userId: number,
    data: StockRequest
): Promise<StockResponse> => {
    await validateUserExists(userId);

    if (!data.nama || !data.jumlah || !data.jenis_transaksi) {
        throw new ApiError("Data stok tidak lengkap", 400);
    }

    const existingStock = await StockModel.findExistingStockTransaction(userId, data.nama);
    if (existingStock) {
        throw new ApiError("Stok dengan nama tersebut sudah tersedia", 400);
    }

    const createdStock = await StockModel.createStockTransaction(userId, data);

    return {
        message: "Stok berhasil ditambahkan",
        data: createdStock
    };
};

/**
 * Service untuk mendapatkan semua transaksi stok berdasarkan userId
 */
export const getStocksService = async (userId: number): Promise<StockData[]> => {
    await validateUserExists(userId);

    const stocks = await StockModel.findStockTransactionByUserId(userId);

    return stocks.map(stock => ({
        ...stock,
        tanggal: stock.tanggal ? new Date(stock.tanggal).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) : undefined
    })) as StockData[];
};

/**
 * Service untuk memperbarui transaksi stok
 * Mengimplementasikan logika bisnis untuk perhitungan stok
 */
export const updateStockService = async (
    userId: number,
    stockId: number,
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
                    `Jumlah tidak cukup. Stok ${existingStock.nama} saat ini adalah ${existingStock.jumlah}`,
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

    const updatedStock = await StockModel.updateStockTransaction(stockId, updatedData);

    return {
        message: "Stok berhasil diperbarui",
        data: updatedStock
    };
};

/**
 * Service untuk menghapus transaksi stok
 */
export const deleteStockService = async (
    userId: number,
    stockId: number
): Promise<StockResponse> => {
    await validateUserExists(userId);
    await validateStockOwnership(userId, stockId);

    try {
        const deletedStock = await StockModel.deleteStockTransaction(stockId);

        return {
            message: "Stok berhasil dihapus",
            data: deletedStock
        };
    } catch (error) {
        throw new ApiError("Gagal menghapus stok", 400);
    }
};