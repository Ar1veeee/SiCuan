import MenuModel from "../models/menu.model";
import { ApiError } from "../exceptions/apiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateMenuOwnership } from "../validators/MenuValidator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface MenuResponse {
    message: string;
}

export const createMenuService = async (userId: number, nama_menu: string): Promise<MenuResponse> => {
    await validateUserExists(userId);

    const existingMenu = await MenuModel.findExistingMenu(userId, nama_menu);
    if (existingMenu) {
        throw new ApiError("Menu sudah dipakai", 400)
    }

    try {
        await MenuModel.addMenu(userId, nama_menu);
        return { message: "Menu Berhasil Ditambahkan" }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new ApiError("Gagal menyimpan data menu", 500);
        }
        throw error;
    }
}

export const updateMenuService = async (userId: number, menuId: number, nama_menu: string): Promise<MenuResponse> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);


    try {
        await MenuModel.updateUserMenu(userId, menuId, nama_menu);
        return { message: "Menu Berhasil Diperbarui" }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new ApiError("Gagal memperbarui data menu", 500);
        }
        throw error;
    }
}

export const deleteMenuService = async (userId: number, menuId: number): Promise<MenuResponse> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);

    try {
        await MenuModel.deleteUserMenu(userId, menuId)
        return { message: "Menu Berhasil Dihapus" }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new ApiError("Gagal menghapus data menu", 500);
        }
        throw error;
    }
    
}