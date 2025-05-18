import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import {
    createMenuService,
    deleteMenuService,
    updateMenuService
} from "../services/MenuService";
import MenuModel from "../models/menu.model";
import { ApiError } from "../exceptions/ApiError";

// Controller untuk menambah menu
export const createMenu = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const { nama_menu } = req.body;

    if (!user_id || !nama_menu) {
        apiResponse.badRequest(
            res,
            "Data yang dibutuhkan tidak dapat ditemukan"
        )
        return
    }

    try {
        const userId = parseInt(user_id, 10);
        const result = await createMenuService(userId, nama_menu);
        apiResponse.created(res, result)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}

// Controller untuk mendapatkan menu berdasarkan user_id
export const getMenus = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;
    if (!user_id) {
        apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak dapat ditemukan"
        )
        return
    }

    try {
        const userId = parseInt(user_id, 10);
        const menus = await MenuModel.findMenusByUserId(userId);
        apiResponse.success(res, { menus })
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}

// Controller untuk memperbarui menu
export const updateMenu = async (req: Request, res: Response): Promise<void> => {
    const { user_id, menu_id } = req.params;
    const { nama_menu } = req.body;

    if (!user_id || !menu_id) {
        apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak ditemukan"
        )
        return
    }
    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const updatedMenu = await updateMenuService(userId, menuId, nama_menu);
        apiResponse.success(res, updatedMenu);
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}

export const deleteMenu = async (req: Request, res: Response): Promise<void> => {
    const { user_id, menu_id } = req.params;
    if (!user_id || !menu_id) {
        apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak ditemukan"
        )
        return
    }
    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const result = await deleteMenuService(userId, menuId)
        apiResponse.success(res, result)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}