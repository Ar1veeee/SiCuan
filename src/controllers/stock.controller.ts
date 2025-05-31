import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import {
    createStockService,
    getStocksService,
    getStockDetailService,
    updateStockService,
    deleteStockService,
} from "../services/StockService";
import { handleStockError } from "../middlewares/stock.middleware";

/**
 * Controller untuk membuat transaksi stok baru
 */
export const createStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const result = await createStockService(userId, req.body);
        apiResponse.created(res, result);
    } catch (error) {
        handleStockError(error, res);
    }
};

/**
 * Controller untuk mendapatkan semua transaksi stok user
 */
export const getStocks = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }
        const stocks = await getStocksService(userId);
        apiResponse.success(res, { stocks });
    } catch (error) {
        handleStockError(error, res);
    }
};

/**
 * Controller untuk mendapatkan detail stok berdasarkan ID
 */
export const getStockDetail = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }
        const stock = await getStockDetailService(userId, req.stockId!);
        apiResponse.success(res, { stock });
    } catch (error) {
        handleStockError(error, res);
    }
};

/**
 * Controller untuk memperbarui transaksi stok
 */
export const updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }
        const result = await updateStockService(userId, req.stockId!, req.body);
        apiResponse.success(res, result);
    } catch (error) {
        handleStockError(error, res);
    }
};

/**
 * Controller untuk menghapus transaksi stok
 */
export const deleteStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }
        const result = await deleteStockService(userId, req.stockId!);
        apiResponse.success(res, result);
    } catch (error) {
        handleStockError(error, res);
    }
};