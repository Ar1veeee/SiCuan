import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { CreateSalesRequest, SalesResponse } from "../../types/sales.type";

/**
 * Controller untuk membuat penjualan
 * @param req 
 * @param res 
 * @param next 
 */
export const createSalesController = (
    { createSalesService }: {
        createSalesService: (userId: string, data: CreateSalesRequest) => Promise<SalesResponse>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await createSalesService(req.userId!, req.body);
            apiResponse.created(res, result);
        } catch (error) {
            next(error);
        }
    }