import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import {
    getStocksService,
    createStockTransactionService,
    getStockSummaryService,
    deleteStockService,
} from "../services/StockService";
import { formatStockDetailResponse } from "../utils/stockFormatter.util";

/**
 * Controller untuk mendapatkan total bahan dan bahan yang hampir habis
 * @param req 
 * @param res 
 * @param next 
 */
export const getStockSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const summary = await getStockSummaryService(req.userId!);
        apiResponse.success(res, summary);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk mendapatkan semua transaksi stok user
 * @param req 
 * @param res 
 * @param next 
 */
export const getStocks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stocks = await getStocksService(req.userId!);
        apiResponse.success(res, { stocks });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk mendapatkan detail stok berdasarkan ID
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const getStockDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const bahanData = req.bahanData;
        const formattedResponse = formatStockDetailResponse(bahanData)
        apiResponse.success(res, { stock:formattedResponse });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk memperbarui transaksi stok
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const createStockTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await createStockTransactionService(req.userId!, req.bahanData, req.body);
        apiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk menghapus transaksi stok
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const deleteStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await deleteStockService(req.bahanId!);
        apiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
};