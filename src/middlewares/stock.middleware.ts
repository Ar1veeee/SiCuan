import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../utils/apiResponse.util';
import StockModel from '../models/stock.model';
import { validateUserExists } from '../validators/UserValidator';
import { validateStockOwnership } from '../validators/StockValidator';
import { ApiError } from '../exceptions/ApiError';
import { JenisTransaksi, StockData } from '../types/stock.type'; // Import the types
import { isValidULID } from '../validators/IdValidator';

export const validateStockId = (req: Request, res: Response, next: NextFunction): void => {
    const { stock_id } = req.params;

    if (!stock_id) {
        apiResponse.badRequest(res, "Stock ID diperlukan");
        return;
    }

    if (!isValidULID(stock_id)) {
        apiResponse.badRequest(res, "Format Stock ID tidak valid");
        return;
    }

    req.stockId = stock_id;
    next();
};

export const verifyStockOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.userId) {
            apiResponse.badRequest(res, "User ID diperlukan");
            return;
        }

        if (!req.stockId) {
            apiResponse.badRequest(res, "Stock ID diperlukan");
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
    if (error instanceof ApiError) {
        apiResponse.error(res, error.message, error.statusCode);
    } else {
        apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
    }
};