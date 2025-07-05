import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import { createSalesService, getSalesService, getSalesSummaryService } from "../services/SalesService";

/**
 * Controller untuk mendapatkan total penjualan dan keuntungan
 * @param req 
 * @param res 
 * @param next 
 */
export const getSalesSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const summary = await getSalesSummaryService(req.userId!);
        apiResponse.success(res, summary);
    } catch (error) {
        next(error);
    }
}

export const getSales = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sales = await getSalesService(
            req.userId!,
            req.query.startDate as string,
            req.query.endDate as string
        );
        apiResponse.success(res, { sales });
    } catch (error) {
        next(error);
    }
}

/**
 * Controller untuk membuat penjualan
 * @param req 
 * @param res 
 * @param next 
 */
export const createSales = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await createSalesService(req.userId!, req.body);
        apiResponse.created(res, result);
    } catch (error) {
        next(error);
    }
}