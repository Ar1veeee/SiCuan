import Menu from "../models/menu.model";
import { ApiError } from "../exceptions/ApiError";
import {z} from "zod"

export const validateMenuOwnership = async (userId: number, menuId: number) => {
    if (isNaN(menuId)) {
        throw new ApiError("Menu ID tidak valid", 400)
    }

    const menu = await Menu.findMenuByIdAndUserId(userId, menuId)
    if (!menu) {
        throw new ApiError("Menu tidak dapat ditemukan", 400)
    }
    return menu
}

export const menuSchema = z.object({
    nama_menu: z.string().nonempty('Nama menu wajib diisi')
})