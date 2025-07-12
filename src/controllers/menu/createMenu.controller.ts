import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { MenuResponse } from "../../types/menu.type";

/**
 * Controller untuk menambah menu
 * @param req 
 * @param res 
 * @returns 
 */
export const createMenuController = (
    { createMenuService }: {
        createMenuService: (userId: string, nama_menu: string) => Promise<MenuResponse>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId!;

        const result = await createMenuService(userId, req.body.nama_menu);
        apiResponse.created(res, result);
    } catch (error) {
        next(error);
    }
};