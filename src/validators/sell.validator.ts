import Menu from "../models/menu.model";
import { ApiError } from "../exceptions/ApiError";
import {z} from "zod"

export const validateMenuOwnership = async (userId: string, menuId: string) => {
    const menu = await Menu.findMenuByIdAndUserId(userId, menuId)
    if (!menu) {
        throw new ApiError("Menu tidak dapat ditemukan", 400)
    }
    return menu
}

export const sellSchema = z.object({
    hpp: z.number().min(1, 'HPP harus lebih dari 0'),
    keuntungan: z.number().min(1, 'Keuntungan harus lebih dari 0')
})