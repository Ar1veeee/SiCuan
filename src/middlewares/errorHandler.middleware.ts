import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/ApiError';
import logger from '../config/logger.config'; 

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction):void => {
    if (err instanceof ApiError) {
        logger.info(`Handled ApiError: ${err.statusCode} - ${err.message} - URL: ${req.originalUrl}`);
        
        res.status(err.statusCode).json({
            status: 'fail',
            message: err.message
        });
        return
    }

    logger.error('Unhandled Exception:', { 
        message: err.message, 
        stack: err.stack
    });

    res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan internal pada server.'
    });
    return
};