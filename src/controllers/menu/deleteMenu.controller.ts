import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { MenuResponse } from "../../types/menu.type";

/**
 * Controller untuk menghapus menu
 * @param req
 * @param res
 * @returns
 */
export const deleteMenuController =
  ({
    deleteMenuService,
  }: {
    deleteMenuService: (menuId: string) => Promise<MenuResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const menuId = req.menuId!;
      const result = await deleteMenuService(menuId);
      apiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
