import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../utils/apiResponse.util';
import { ApiError } from '../exceptions/ApiError';
import MenuModel from '../models/menu.model';

/**
 * Middleware untuk validasi Menu ID
 */
export const validateMenuId = (req: Request, res: Response, next: NextFunction): void => {
    const { menu_id } = req.params;

    if (!menu_id) {
        apiResponse.badRequest(res, "Menu ID diperlukan");
        return;
    }

    try {
        const menuId = parseInt(menu_id, 10);
        if (isNaN(menuId)) {
            apiResponse.badRequest(res, "Menu ID harus berupa angka");
            return;
        }

        req.menuId = menuId;
        next();
    } catch (error) {
        apiResponse.badRequest(res, "Format Menu ID tidak valid");
    }
};

/**
 * Middleware untuk verifikasi kepemilikan menu
 */
export const verifyMenuOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.userId) {
            apiResponse.badRequest(res, "User ID tidak tersedia di token");
            return;
        }

        if (!req.menuId) {
            apiResponse.badRequest(res, "Menu ID diperlukan");
            return;
        }

        const menuExists = await MenuModel.findMenuByIdAndUserId(req.userId, req.menuId);

        if (!menuExists) {
            apiResponse.forbidden(res, "Anda tidak memiliki akses ke menu ini");
            return;
        }

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode);
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan saat verifikasi kepemilikan menu");
        }
    }
};

/**
 * Handler error global untuk controller menu
 */
export const handleMenuError = (error: unknown, res: Response): void => {
    console.error("[Menu Error]:", error);

    if (error instanceof ApiError) {
        apiResponse.error(res, error.message, error.statusCode);
    } else {
        apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
    }
};