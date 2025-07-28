import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { SalesSummaryResponse } from "../../types/sales.type";

export const getSalesCustomController =
  ({
    getSalesCustomService,
  }: {
    getSalesCustomService: (
      userId: string,
      startDate: string,
      endDate: string
    ) => Promise<SalesSummaryResponse[]>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sales = await getSalesCustomService(
        req.userId!,
        req.query.startDate as string,
        req.query.endDate as string
      );
      apiResponse.success(res, { sales });
    } catch (error) {
      next(error);
    }
  };
