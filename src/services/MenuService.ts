"use strict";

import MenuModel from "../models/MenuModel";
import { ApiError } from "../exceptions/apiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateMenuOwnership } from "../validators/MenuValidator";

export const createMenuForUser = async (userId: number, nama_menu: string): Promise<object> => {
    await validateUserExists(userId);

    const existingMenu = await MenuModel.existingMenu(userId, nama_menu);
    if (existingMenu) {
        throw new ApiError("Menu sudah dipakai", 400)
    }

    await MenuModel.addMenu(userId, nama_menu);
    return { message: "Menu Berhasil Ditambahkan" }
}

export const updateMenuForUser = async (userId: number, menuId: number, nama_menu: string): Promise<object> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);

    const updated = await MenuModel.updateUserMenu(userId, menuId, nama_menu);
    if (!updated) {
        throw new ApiError("Menu Gagal Diperbarui", 400)
    }
    return { message: "Menu Berhasil Diperbarui" }
}

export const deleteMenuForUser = async (userId: number, menuId: number): Promise<object> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);

    const deleted = await MenuModel.deleteUserMenu(userId, menuId)
    if (!deleted) {
        throw new ApiError("Menu Gagal Dihapus", 400)
    }
    return { message: "Menu Berhasil Dihapus" }
}