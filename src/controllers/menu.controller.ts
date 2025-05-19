import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import {
    createMenuService,
    getMenusService,
    getMenuDetailService,
    deleteMenuService,
    updateMenuService,
} from "../services/MenuService";
import { handleMenuError } from "../middlewares/menu.middleware";

/**
 * Controller untuk menambah menu
 */
export const createMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }
        
        const result = await createMenuService(userId, req.body.nama_menu);
        apiResponse.created(res, result);
    } catch (error) {
        handleMenuError(error, res);
    }
};

/**
 * Controller untuk mendapatkan semua menu pengguna saat ini
 */
export const getMenus = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }
        
        const menus = await getMenusService(userId);
        apiResponse.success(res, { menus });
    } catch (error) {
        handleMenuError(error, res);
    }
};

/**
 * Controller untuk mendapatkan detail menu berdasarkan ID
 */
export const getMenuDetail = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }
        
        const menuId = req.menuId!;
        const menu = await getMenuDetailService(userId, menuId);
        apiResponse.success(res, { menu });
    } catch (error) {
        handleMenuError(error, res);
    }
};

/**
 * Controller untuk memperbarui menu
 */
export const updateMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }
        
        const menuId = req.menuId!;
        const result = await updateMenuService(userId, menuId, req.body.nama_menu);
        apiResponse.success(res, result);
    } catch (error) {
        handleMenuError(error, res);
    }
};

/**
 * Controller untuk menghapus menu
 */
export const deleteMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }
        
        const menuId = req.menuId!;
        const result = await deleteMenuService(userId, menuId);
        apiResponse.success(res, result);
    } catch (error) {
        handleMenuError(error, res);
    }
};