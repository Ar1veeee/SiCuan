import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../utils/apiResponse.util';
import { validatePassowrd } from '../validators/PasswordValidator';
import { ApiError } from '../exceptions/ApiError';


export const validatePasswordMatch = (req: Request, res: Response, next: NextFunction): void => {
    const { newPassword, confirmPassword } = req.body;

    const validateMessage = validatePassowrd(newPassword, confirmPassword);
    if (validateMessage) {
        apiResponse.badRequest(res, validateMessage);
        return;
    }

    next();
};

/**
 * Handler error global untuk controller profile
 */
export const handleProfileError = (error: unknown, res: Response): void => {
    console.error("[Profile Error]:", error);

    if (error instanceof ApiError) {
        apiResponse.error(res, error.message, error.statusCode);
    } else {
        apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
    }
};