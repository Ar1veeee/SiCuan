import MenuModel from "../models/menu.model";
import { ApiError } from "../exceptions/ApiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateMenuOwnership } from "../validators/MenuValidator";
import { MenuData, MenuResponse } from "../types/menu.type";

/**
 * Service untuk membuat menu baru
 */
export const createMenuService = async (
    userId: number,
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
export const getMenusService = async (userId: number): Promise<MenuData[]> => {
    await validateUserExists(userId);

    const menus = await MenuModel.findMenusByUserId(userId);

    return menus;
};

/**
 * Service untuk mendapatkan detail menu spesifik
 */
export const getMenuDetailService = async (
    userId: number,
    menuId: number,
): Promise<MenuData> => {
    await validateUserExists(userId);

    console.log("Cache miss for menu detail");

    const menuDetail = await MenuModel.findMenuByIdAndUserId(userId, menuId);

    if (!menuDetail) {
        throw new ApiError("Menu tidak ditemukan", 404);
    }

    const menuDetailWithFormatted = {
        ...menuDetail,
        createdAtFormatted: menuDetail.createdAt
            ? new Date(menuDetail.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
            : undefined,
        updatedAtFormatted: menuDetail.updatedAt
            ? new Date(menuDetail.updatedAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
            : undefined
    };

    return menuDetailWithFormatted;
};

/**
 * Service untuk mengupdate menu
 */
export const updateMenuService = async (
    userId: number,
    menuId: number,
    nama_menu: string
): Promise<MenuResponse> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);

    await MenuModel.updateMenu(userId, menuId, nama_menu);

    return {
        message: "Menu berhasil diperbarui",
    };
};

/**
 * Service untuk menghapus menu
 */
export const deleteMenuService = async (
    userId: number,
    menuId: number
): Promise<MenuResponse> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);

    await MenuModel.deleteMenu(menuId);

    return {
        message: "Menu berhasil dihapus",
    };
};