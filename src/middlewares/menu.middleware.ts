import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/ApiError";
import MenuModel from "../models/menu.model";
import { isValidULID } from "../validators/ulid.validator";

/**
 * Middleware untuk validasi Menu ID
 */
export const validateMenuId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { menu_id } = req.params;

    if (!menu_id) {
      throw ApiError.badRequest("Menu ID diperlukan");
    }

    if (!isValidULID(menu_id)) {
      throw ApiError.badRequest("Format Menu ID tidak valid");
    }

    req.menuId = menu_id;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk verifikasi kepemilikan menu
 */
export const verifyAndAttachMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId || !req.menuId) {
      throw ApiError.badRequest("ID User atau Menu tidak tersedia.");
    }

    const menu = await MenuModel.findMenuByIdAndUserId(req.userId, req.menuId);

    if (!menu) {
      throw ApiError.forbidden(
        "Menu tidak ditemukan atau Anda tidak memiliki akses."
      );
    }

    req.menu = menu;

    next();
  } catch (error) {
    next(error);
  }
};
