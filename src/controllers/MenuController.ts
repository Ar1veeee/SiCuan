import { Request, Response } from "express";
import { apiResponse } from "../utils/ApiResponseUtil";
import { createMenuForUser, deleteMenuForUser, updateMenuForUser } from "../services/MenuService";
import Menu from "../models/MenuModel";

export const createMenu = async (req: Request, res: Response): Promise<any> => {
    const { user_id } = req.params;
    const { nama_menu } = req.body;

    if (!user_id || !nama_menu) {
        return apiResponse.badRequest(
            res,
            "Data yang dibutuhkan tidak dapat ditemukan"
        )
    }

    try {
        const userId = Number(user_id);
        const result = await createMenuForUser(userId, nama_menu);
        return apiResponse.created(res, result)
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}

export const getMenus = async (req: Request, res: Response): Promise<any> => {
    const { user_id } = req.params;
    if (!user_id) {
        return apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak dapat ditemukan"
        )
    }

    try {
        const userId = Number(user_id);
        const menus = await Menu.findMenuByUserId(userId);
        return apiResponse.success(res, { menus })
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}

export const updateMenu = async (req: Request, res: Response): Promise<any> => {
    const { user_id, menu_id } = req.params;
    const { nama_menu } = req.body;

    if (!user_id && !menu_id) {
        return apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak ditemukan"
        )
    }
    try {
        const userId = Number(user_id);
        const menuId = Number(menu_id);
        const result = await updateMenuForUser(userId, menuId, nama_menu);
        return apiResponse.success(res, result);
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message);
    }
}

export const deleteMenu = async (req: Request, res: Response): Promise<any> => {
    const { user_id, menu_id } = req.params;
    if (!user_id || !menu_id) {
        return apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak ditemukan"
        )
    }
    try {
        const userId = Number(user_id);
        const menuId = Number(menu_id);
        const result = await deleteMenuForUser(userId, menuId)
        return apiResponse.success(res, result)
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}