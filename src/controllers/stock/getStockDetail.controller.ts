import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { formatStockDetailResponse } from "../../utils/stockFormatter.util";

/**
 * Controller untuk mendapatkan detail stok berdasarkan ID
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const getStockDetailController =
  () =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bahanData = req.bahanData;
      const formattedResponse = formatStockDetailResponse(bahanData);
      apiResponse.success(res, { stock: formattedResponse });
    } catch (error) {
      next(error);
    }
  };
