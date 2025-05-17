// controllers/stockController.ts
import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import {
    createStockService,
    getStocksService,
    updateStockService,
    deleteStockService
} from "../services/StockService";
import { handleStockError } from "../middlewares/stock.middleware";

/**
 * Controller untuk membuat transaksi stok baru
 */
export const createStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await createStockService(req.userId!, req.body);
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
        const stocks = await getStocksService(req.userId!);
        apiResponse.success(res, { stocks });
    } catch (error) {
        handleStockError(error, res);
    }
};

/**
 * Controller untuk memperbarui transaksi stok
 */
export const updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await updateStockService(req.userId!, req.stockId!, req.body);
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
        const result = await deleteStockService(req.userId!, req.stockId!);
        apiResponse.success(res, result);
    } catch (error) {
        handleStockError(error, res);
    }
};