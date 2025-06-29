import MenuModel from "../models/menu.model";
import { ApiError } from "../exceptions/ApiError";
import { MenuData, MenuResponse } from "../types/menu.type";
import { updateTotalHPPService } from "./HppService";

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
        throw new ApiError("Nama menu tersebut sudah digunakan oleh menu lain", 400);
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
    menuId: string,
    hpp: number,
    keuntungan: number
): Promise<MenuResponse> => {
    await MenuModel.updateKeuntungan(menuId, keuntungan);
    await updateTotalHPPService(menuId);
    
    const menuTerbaru = await MenuModel.findMenuById(menuId);

    return {
        message: `Keuntungan berhasil diatur menjadi ${keuntungan}%. Harga Jual baru sekarang adalah Rp.${menuTerbaru?.harga_jual ?? 0}`
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