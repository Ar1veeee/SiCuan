import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { SalesResponse } from "../../types/sales.type";

export const deleteSalesController =
  ({
    deleteSalesService,
  }: {
    deleteSalesService: (
      userId: string,
      salesId: string
    ) => Promise<SalesResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const salesId = req.salesId!;
      const result = await deleteSalesService(userId, salesId);
      apiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
