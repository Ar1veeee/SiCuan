import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import {
    createMenuService,
    getMenusService,
    deleteMenuService,
    updateMenuService,
    menuSellingPriceService,
} from "../services/MenuService";

/**
 * Controller untuk menambah menu
 * @param req 
 * @param res 
 * @returns 
 */

export const createMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const result = await createMenuService(userId, req.body.nama_menu);
        apiResponse.created(res, result);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk mendapatkan semua menu pengguna saat ini
 * @param req 
 * @param res 
 * @returns
 */
export const getMenus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const menus = await getMenusService(userId);
        apiResponse.success(res, { menus });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk mendapatkan detail menu berdasarkan ID
 * @param req 
 * @param res 
 * @returns
 */
export const getMenuDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const menuDetail = req.menu;
        apiResponse.success(res, { menu: menuDetail });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk mendapatkan detail menu berdasarkan ID
 * @param req 
 * @param res 
 * @returns
 */
export const menuSellingPrice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const menu = req.menu;
        const { keuntungan } = req.body;

        const result = await menuSellingPriceService(menu.id, menu.hpp!, keuntungan);
        apiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
}

/**
 * Controller untuk memperbarui menu
 * @param req 
 * @param res 
 * @returns
 */
export const updateMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId!;
        const menuId = req.menu.id;

        const result = await updateMenuService(userId, menuId, req.body.nama_menu);
        apiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk menghapus menu
 * @param req 
 * @param res 
 * @returns
 */
export const deleteMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const menuId = req.menuId!;
        const result = await deleteMenuService(menuId);
        apiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
};