import Menu from "../models/MenuModel";
import { ApiError } from "../exceptions/apiError";
import { validateMenuOwnership, validateUserExists } from "../utils/ValidationUtil";

export const addUserMenu = async (userId: number, name_menu: string): Promise<any> => {
    await validateUserExists(userId);

    const existingMenu = await Menu.existingMenu(userId, name_menu);
    if (existingMenu) {
        throw new ApiError("Menu sudah ada", 400)
    }

    await Menu.addMenu(userId, name_menu);
    return "Menu Berhasil Ditambahkan";
}

export const updateUserMenu = async (userId: number, menuId: number, nama_menu: string): Promise<any> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);

    const updated = await Menu.updateUserMenu(userId, menuId, nama_menu);
    if (!updated) {
        throw new ApiError("Update Menu Gagal", 400)
    }
    return "Update Menu Berhasil"
}

export const deleteUserMenu = async (userId: number, menuId: number,): Promise<any> => {
    await validateUserExists(userId);
    await validateMenuOwnership(userId, menuId);

    const deleted = await Menu.deleteUserMenu(userId, menuId)
    if (!deleted) {
        throw new ApiError("Menu Gagal Dihapus", 400)
    }
    return "Menu Berhasil Dihapus"
}