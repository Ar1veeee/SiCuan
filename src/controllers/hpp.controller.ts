import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import { createRecipeService, deleteRecipeService, updateRecipeService } from "../services/HppService";
import Hpp from "../models/hpp.model";
import { ApiError } from "../exceptions/apiError";

// Controller untuk menambah resep
export const createResep = async (req: Request, res: Response): Promise<void> => {
    const { user_id, menu_id } = req.params;
    const bahan = req.body;

    if (!user_id || !menu_id) {
        apiResponse.badRequest(
            res,
            "Data yang dibutuhkan tidak dapat ditemukan"
        )
        return
    }

    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const addResep = await createRecipeService(userId, menuId, bahan)
        apiResponse.created(
            res,
            addResep
        )
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}

// Controller untuk mendapatkan resep berdasarkan user_id dan menu_id
export const getRecipes = async (req: Request, res: Response): Promise<void> => {
    const { user_id, menu_id } = req.params;
    if (!user_id || !menu_id) {
        apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak dapat ditemukan"
        )
        return
    }

    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const recipes = await Hpp.findResepByUserIdAndMenuId(userId, menuId)
        apiResponse.success(res, recipes)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}

// Controller untuk mengupdate resep berdasarkan user_id, menu_id, dan bahan_id
export const updateMenuResep = async (req: Request, res: Response): Promise<void> => {
    const { user_id, menu_id, bahan_id } = req.params
    const bahan = req.body

    if (!user_id || !menu_id || !bahan_id) {
        apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak ditemukan"
        )
        return
    }

    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const bahanId = parseInt(bahan_id, 10);

        const updatedRecipe = await updateRecipeService(userId, menuId, bahanId, bahan)

        apiResponse.success(res, updatedRecipe)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}

// Controller untuk menghapus resep berdasarkan user_id, menu_id, dan bahan_id
export const deleteMenuResep = async (req: Request, res: Response): Promise<void> => {
    const { user_id, menu_id, bahan_id } = req.params
    if (!user_id || !menu_id || !bahan_id) {
        apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak ditemukan"
        )
        return
    }
    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const bahanId = parseInt(bahan_id, 10);
        const deletedRecipe = await deleteRecipeService(userId, menuId, bahanId)
        apiResponse.success(res, deletedRecipe)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}