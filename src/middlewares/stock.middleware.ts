import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../utils/apiResponse.util';
import StockModel from '../models/stock.model';
import { validateUserExists } from '../validators/UserValidator';
import { validateStockOwnership } from '../validators/StockValidator';
import { ApiError } from '../exceptions/apiError';
import { JenisTransaksi, StockData } from '../types/stock.type'; // Import the types

export const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
    const { user_id } = req.params;

    if (!user_id) {
        apiResponse.badRequest(res, "User ID diperlukan");
        return;
    }

    try {
        const userId = parseInt(user_id, 10);
        if (isNaN(userId)) {
            apiResponse.badRequest(res, "User ID harus berupa angka");
            return;
        }

        req.userId = userId;
        next();
    } catch (error) {
        apiResponse.badRequest(res, "Format User ID tidak valid");
    }
};

export const validateStockId = (req: Request, res: Response, next: NextFunction): void => {
    const { stock_id } = req.params;

    if (!stock_id) {
        apiResponse.badRequest(res, "Stock ID diperlukan");
        return;
    }

    try {
        const stockId = parseInt(stock_id, 10);
        if (isNaN(stockId)) {
            apiResponse.badRequest(res, "Stock ID harus berupa angka");
            return;
        }

        req.stockId = stockId;
        next();
    } catch (error) {
        apiResponse.badRequest(res, "Format Stock ID tidak valid");
    }
};

export const verifyStockOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.userId || !req.stockId) {
            apiResponse.badRequest(res, "User ID dan Stock ID diperlukan");
            return;
        }

        await validateUserExists(req.userId);
        await validateStockOwnership(req.userId, req.stockId);

        // Tambahkan data stock ke request untuk digunakan di controller
        const rawStockData = await StockModel.findStockTransactionByIdAndUserId(req.userId, req.stockId);
        if (!rawStockData) {
            throw new ApiError("Stock tidak ditemukan", 404);
        }

        // Convert string jenis_transaksi to JenisTransaksi type and handle null keterangan
        const stockData: StockData = {
            ...rawStockData,
            jenis_transaksi: rawStockData.jenis_transaksi as JenisTransaksi,
            keterangan: rawStockData.keterangan ?? '' // Convert null to empty string
        };

        req.stockData = stockData;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode);
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan saat verifikasi kepemilikan stock");
        }
    }
};

/**
 * Handler error global untuk controller stock
 */
export const handleStockError = (error: unknown, res: Response): void => {
    // Untuk production, gunakan logger yang proper seperti Winston atau Pino
    console.error("[Stock Error]:", error);

    if (error instanceof ApiError) {
        apiResponse.error(res, error.message, error.statusCode);
    } else {
        apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
    }
};