import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { SummaryResponse } from "../../types/stock.type";

/**
 * Controller untuk mendapatkan total bahan dan bahan yang hampir habis
 * @param req 
 * @param res 
 * @param next 
 */
export const getStockSummaryController = (
    { getStockSummaryService }: {
        getStockSummaryService: (userId: string) => Promise<SummaryResponse>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const summary = await getStockSummaryService(req.userId!);
        apiResponse.success(res, summary);
    } catch (error) {
        next(error);
    }
};