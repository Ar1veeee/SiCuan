import MenuModel from "../models/menu.model";
import { ApiError } from "../exceptions/ApiError";
import { MenuData, MenuResponse } from "../types/menu.type";
import { updateTotalHPPService } from "./RecipeService";

/**
 * Service untuk membuat menu baru
 * @param userId 
 * @param nama_menu 
 * @returns 
 */
export const createMenuService = async (
    userId: string,
    nama_menu: string
): Promise<MenuResponse> => {
    const existingMenu = await MenuModel.findMenuByName(userId, nama_menu);
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
 * @param userId 
 * @returns 
 */
export const getMenusService = async (userId: string): Promise<MenuData[]> => {
    const menus = await MenuModel.findMenusByUserId(userId);

    return menus;
};

/**
 * Service untuk memperbarui menu
 * @param userId 
 * @param menuId 
 * @param nama_menu 
 * @returns 
 */
export const updateMenuService = async (
    userId: string,
    menuId: string,
    nama_menu: string
): Promise<MenuResponse> => {
    const existingMenu = await MenuModel.findMenuByName(userId, nama_menu);
    if (existingMenu && existingMenu.id !== menuId) {
        throw new ApiError("Nama menu tersebut sudah digunakan oleh menu lain", 409);
    }

    await MenuModel.updateMenu(menuId, nama_menu);

    return {
        message: "Menu berhasil diperbarui",
    };
};

/**
 * Service untuk memperbarui keuntungan dan harga jual menu
 * @param userId 
 * @param nama_menu 
 * @param hpp 
 * @param keuntungan 
 * @returns 
 */
export const menuSellingPriceService = async (
    userId: string,
    nama_menu: string,
    keuntungan: number
): Promise<MenuResponse> => {
    const menu = await MenuModel.findMenuByName(userId, nama_menu);
    if (!menu) {
        throw ApiError.notFound(`Menu ${nama_menu} tidak ditemukan`);
    }

    const hppMenu = menu?.hpp;

    if (typeof hppMenu !== 'number') {
        throw ApiError.badRequest(`HPP untuk menu ${nama_menu} belum dihitung. Silahkan tambahkan resep terlebih dahulu.`);
    }
    const harga_jual = Math.round(hppMenu + (keuntungan / 100) * hppMenu);

    await MenuModel.updateMenuPricing(menu.id, keuntungan, harga_jual)

    return {
        message: `Harga Jual untuk menu ${nama_menu} dengan keuntungan ${keuntungan}% berhasil diperbarui menjadi Rp.${harga_jual}`
    };
};

/**
 * Service untuk menghapus menu
 * @param menuId 
 * @returns 
 */
export const deleteMenuService = async (
    menuId: string
): Promise<MenuResponse> => {
    await MenuModel.deleteMenu(menuId);

    return {
        message: "Menu berhasil dihapus",
    };
};