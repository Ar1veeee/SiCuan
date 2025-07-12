import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { StockSummaryResponse } from "../../types/stock.type";

/**
 * Controller untuk mendapatkan semua transaksi stok user
 * @param req 
 * @param res 
 * @param next 
 */
export const getStocksController = (
    { getStocksService }: {
        getStocksService: (userId: string) => Promise<StockSummaryResponse>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const stocks = await getStocksService(req.userId!);
            apiResponse.success(res, { stocks });
        } catch (error) {
            next(error);
        }
    };