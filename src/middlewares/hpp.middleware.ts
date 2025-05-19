import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../utils/apiResponse.util';
import { validateUserExists } from '../validators/UserValidator';
import { validateMenuOwnership } from '../validators/MenuValidator';
import { ApiError } from '../exceptions/ApiError';

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

export const validateBahanId = (req: Request, res: Response, next: NextFunction): void => {
    const { bahan_id } = req.params;

    if (!bahan_id) {
        apiResponse.badRequest(res, "Bahan ID diperlukan");
        return;
    }

    try {
        const bahanId = parseInt(bahan_id, 10);
        if (isNaN(bahanId)) {
            apiResponse.badRequest(res, "Bahan ID harus berupa angka");
            return;
        }

        req.bahanId = bahanId;
        next();
    } catch (error) {
        apiResponse.badRequest(res, "Format Bahan ID tidak valid");
    }
};

export const verifyHppOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.userId || !req.menuId) {
            apiResponse.badRequest(res, "User ID dan Menu ID diperlukan");
            return;
        }

        await validateUserExists(req.userId);
        await validateMenuOwnership(req.userId, req.menuId);

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
 * Handler error global untuk controller hpp
 */
export const handleHppError = (error: unknown, res: Response): void => {
    // Untuk production, gunakan logger yang proper seperti Winston atau Pino
    console.error("[HPP Error]:", error);

    if (error instanceof ApiError) {
        apiResponse.error(res, error.message, error.statusCode);
    } else {
        apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
    }
};