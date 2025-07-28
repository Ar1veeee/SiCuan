import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";

/**
 * Controller untuk mendapatkan detail menu berdasarkan ID
 * @param req
 * @param res
 * @returns
 */
export const getMenuDetailController =
  () =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const menuDetail = req.menu;
      apiResponse.success(res, { menu: menuDetail });
    } catch (error) {
      next(error);
    }
  };
