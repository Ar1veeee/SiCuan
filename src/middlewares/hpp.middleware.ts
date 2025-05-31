import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../utils/apiResponse.util';
import { validateUserExists } from '../validators/UserValidator';
import { validateMenuOwnership } from '../validators/MenuValidator';
import { ApiError } from '../exceptions/ApiError';
import { isValidULID } from '../validators/IdValidator';

export const validateMenuId = (req: Request, res: Response, next: NextFunction): void => {
    const { menu_id } = req.params;

    if (!menu_id) {
        apiResponse.badRequest(res, "Menu ID diperlukan");
        return;
    }

    if (!isValidULID(menu_id)) {
        apiResponse.badRequest(res, "Format Menu ID tidak valid");
        return;
    }
    req.menuId = menu_id;
    next();
};

export const validateBahanId = (req: Request, res: Response, next: NextFunction): void => {
    const { bahan_id } = req.params;

    if (!bahan_id) {
        apiResponse.badRequest(res, "Bahan ID diperlukan");
        return;
    }

    if (!isValidULID(bahan_id)) {
        apiResponse.badRequest(res, "Format Menu ID tidak valid");
        return;
    }

    req.bahanId = bahan_id;
    next();
};

export const verifyHppOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.userId) {
            apiResponse.badRequest(res, "User ID diperlukan");
            return;
        }
        if (!req.menuId) {
            apiResponse.badRequest(res, "Menu ID diperlukan");
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