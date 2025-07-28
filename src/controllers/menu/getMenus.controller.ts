import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { MenuData } from "../../types/menu.type";

/**
 * Controller untuk mendapatkan semua menu pengguna saat ini
 * @param req
 * @param res
 * @returns
 */
export const getMenusController =
  ({
    getMenusService,
  }: {
    getMenusService: (userId: string) => Promise<MenuData[]>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;

      const menus = await getMenusService(userId);
      apiResponse.success(res, { menus });
    } catch (error) {
      next(error);
    }
  };
