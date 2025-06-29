import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import { ApiError } from "../exceptions/ApiError";

/**
 * Middleware untuk verifikasi akses user
 * @param req 
 * @param res 
 * @param next 
 */
const verifyUserAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const paramId = parseInt(req.params.user_id)
        const tokenUserId = (req.user?.id) ?? null;
    
        if (!paramId || !tokenUserId) {
            throw ApiError.unauthorized("User ID tidak valid")
        }
        if (paramId !== tokenUserId) {
            throw ApiError.forbidden("Akses ditolak: token bukan milik user ini")
        }
    
        next()
    } catch (error) {
        next(error)
    }

}

export default verifyUserAccess