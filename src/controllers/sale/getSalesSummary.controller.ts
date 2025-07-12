import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { SummaryResponse } from "../../types/sales.type";

/**
 * Controller untuk mendapatkan total penjualan dan keuntungan
 * @param req 
 * @param res 
 * @param next 
 */
export const getSalesSummaryController = (
    { getSalesSummaryService }: {
        getSalesSummaryService: (userId: string) => Promise<SummaryResponse>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const summary = await getSalesSummaryService(req.userId!);
            apiResponse.success(res, summary);
        } catch (error) {
            next(error);
        }
    }