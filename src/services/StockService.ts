import StockModel from "../models/stock.model";
import { ApiError } from "../exceptions/ApiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateStockOwnership } from "../validators/StockValidator";
import { StockData, StockRequest, StockResponse, JenisTransaksi } from "../types/stock.type";
import redisService from "../services/RedisService";

const CACHE_EXPIRY = 3600;
const STOCK_CACHE_KEY = (userId: number) => `stocks:user:${userId}`;

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

    await StockModel.createStockTransaction(userId, data);

    await redisService.del(STOCK_CACHE_KEY(userId));

    return {
        message: "Stok berhasil ditambahkan",
    };
};

/**
 * Service untuk mendapatkan semua transaksi stok berdasarkan userId
 * Menggunakan Redis untuk caching
 */
export const getStocksService = async (userId: number): Promise<StockData[]> => {
    await validateUserExists(userId);

    const cachedStocks = await redisService.get(STOCK_CACHE_KEY(userId));

    if (cachedStocks) {
        console.log("Cache hit for user stocks");
        return JSON.parse(cachedStocks);
    }

    console.log("Cache miss for user stocks");
    const stocks = await StockModel.findStockTransactionByUserId(userId);

    const formattedStocks = stocks.map(stock => ({
        ...stock,
        tanggalFormatted: stock.tanggal ? new Date(stock.tanggal).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) : undefined
    })) as StockData[];

    await redisService.set(
        STOCK_CACHE_KEY(userId),
        JSON.stringify(formattedStocks),
        CACHE_EXPIRY
    );

    return formattedStocks;
};

/**
 * Service untuk mendapatkan detail stok spesifik
 */
export const getStockDetailService = async (
    userId: number,
    stockId: number
): Promise<StockData> => {
    await validateUserExists(userId);
    
    const stockDetail = await StockModel.findStockTransactionByIdAndUserId(userId, stockId);
    
    if (!stockDetail) {
        throw new ApiError("Stok tidak ditemukan", 404);
    }
    
    const formattedStockDetail = {
        ...stockDetail,
        tanggalFormatted: stockDetail.tanggal ? new Date(stockDetail.tanggal).toLocaleDateString("id-ID", {
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

    await redisService.del(STOCK_CACHE_KEY(userId));

    return {
        message: "Stok berhasil diperbarui",
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

        await redisService.del(STOCK_CACHE_KEY(userId));

        return {
            message: "Stok berhasil dihapus",
        };
    } catch (error) {
        throw new ApiError("Gagal menghapus stok", 400);
    }
};