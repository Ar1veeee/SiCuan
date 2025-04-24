"use strict";

import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/ApiResponseUtil";

const verifyUserAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const paramId = parseInt(req.params.user_id)
    const tokenUserId = (req.user?.id as number) ?? null;

    if (!paramId || !tokenUserId) {
        apiResponse.unauthorized(res, "User ID tidak valid")
        return
    }
    if (paramId !== tokenUserId) {
        apiResponse.forbidden(res, "Akses ditolak: token bukan milik user ini")
        return
    }

    next()
}

export default verifyUserAccess