import MenuModel from "../models/menu.model";
import { ApiError } from "../exceptions/ApiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateMenuOwnership } from "../validators/MenuValidator";
import { MenuData, MenuResponse } from "../types/menu.type";
import { isValidULID } from "../validators/IdValidator";

/**
 * Service untuk membuat menu baru
 */
export const createMenuService = async (
    userId: string,
    nama_menu: string
): Promise<MenuResponse> => {
    await validateUserExists(userId);

    const existingMenu = await MenuModel.findExistingMenu(userId, nama_menu);
    if (existingMenu) {
        throw new ApiError("Menu sudah dipakai", 400);
    }

    await MenuModel.createMenu(userId, nama_menu);

    return {
        message: "Menu berhasil ditambahkan",
    };
};

/**
 * Service untuk mendapatkan semua menu berdasarkan userId
 */
export const getMenusService = async (userId: string): Promise<MenuData[]> => {
    await validateUserExists(userId);

    const menus = await MenuModel.findMenusByUserId(userId);

    return menus;
};

/**
 * Service untuk mendapatkan detail menu spesifik
 */
export const getMenuDetailService = async (
    userId: string,
    menuId: string,
): Promise<MenuData> => {
    await validateUserExists(userId);

    if (!isValidULID(menuId)) {
        throw new ApiError("Format ID menu tidak valid", 400);
    }

    const menuDetail = await MenuModel.findMenuByIdAndUserId(userId, menuId);

    if (!menuDetail) {
        throw new ApiError("Menu tidak ditemukan", 404);
    }

    return menuDetail;
};

/**
 * Service untuk mengupdate menu
 */
export const updateMenuService = async (
    userId: string,
    menuId: string,
    nama_menu: string
): Promise<MenuResponse> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);

    if (!isValidULID(menuId)) {
        throw new ApiError("Format ID menu tidak valid", 400);
    }

    await MenuModel.updateMenu(userId, menuId, nama_menu);

    return {
        message: "Menu berhasil diperbarui",
    };
};

/**
 * Service untuk menghapus menu
 */
export const deleteMenuService = async (
    userId: string,
    menuId: string
): Promise<MenuResponse> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);

    if (!isValidULID(menuId)) {
        throw new ApiError("Format ID menu tidak valid", 400);
    }

    await MenuModel.deleteMenu(menuId);

    return {
        message: "Menu berhasil dihapus",
    };
};