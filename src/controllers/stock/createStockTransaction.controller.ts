import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { Bahan } from "@prisma/client";
import { CreateStockTransactionRequest, DefaultStockResponse } from "../../types/stock.type";

/**
 * Controller untuk memperbarui transaksi stok
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const createStockTransactionController = (
    { createStockTransactionService }: {
        createStockTransactionService: (userId: string, bahan: Bahan, transactionData: CreateStockTransactionRequest) => Promise<DefaultStockResponse>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await createStockTransactionService(req.userId!, req.bahanData, req.body);
            apiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    };