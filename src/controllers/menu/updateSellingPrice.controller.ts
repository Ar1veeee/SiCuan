import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { MenuResponse } from "../../types/menu.type";

/**
 * Controller untuk mendapatkan detail menu berdasarkan ID
 * @param req
 * @param res
 * @returns
 */
export const updateSellingPriceController =
  ({
    menuSellingPriceService,
  }: {
    menuSellingPriceService: (
      userId: string,
      nama_menu: string,
      keuntungan: number
    ) => Promise<MenuResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const { nama_menu, keuntungan } = req.body;

      const result = await menuSellingPriceService(
        userId,
        nama_menu,
        keuntungan
      );
      apiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
