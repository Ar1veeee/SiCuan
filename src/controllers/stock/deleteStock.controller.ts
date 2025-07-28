import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { DefaultStockResponse } from "../../types/stock.type";

/**
 * Controller untuk menghapus transaksi stok
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const deleteStockController =
  ({
    deleteStockService,
  }: {
    deleteStockService: (bahanId: string) => Promise<DefaultStockResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await deleteStockService(req.bahanId!);
      apiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
