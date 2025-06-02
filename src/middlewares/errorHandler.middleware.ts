import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/ApiError';
import { apiResponse } from '../utils/apiResponse.util';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
            statusCode: err.statusCode
        });
        return
    }

    console.error('Unexpected Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    apiResponse.internalServerError(
        res,
    );
};