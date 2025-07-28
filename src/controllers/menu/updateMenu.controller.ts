import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { MenuResponse } from "../../types/menu.type";

/**
 * Controller untuk memperbarui menu
 * @param req
 * @param res
 * @returns
 */
export const updateMenuController =
  ({
    updateMenuService,
  }: {
    updateMenuService: (
      userId: string,
      menuId: string,
      nama_menu: string
    ) => Promise<MenuResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const menuId = req.menu.id;

      const result = await updateMenuService(
        userId,
        menuId,
        req.body.nama_menu
      );
      apiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
