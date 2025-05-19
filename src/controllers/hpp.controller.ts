import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import {
    createRecipeService,
    getRecipesService,
    deleteRecipeService,
    updateRecipeService
} from "../services/HppService";
import { handleHppError } from "../middlewares/hpp.middleware";

/**
 * Controller untuk menambah resep
 */
export const createResep = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const menuId = req.menuId!;

        const result = await createRecipeService(userId, menuId, req.body);
        apiResponse.created(res, result);
    } catch (error) {
        handleHppError(error, res);
    }
};

/**
 * Controller untuk mendapatkan resep berdasarkan user_id dan menu_id
 */
export const getRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const menuId = req.menuId!;

        const recipes = await getRecipesService(userId, menuId);
        apiResponse.success(res, { recipes });
    } catch (error) {
        handleHppError(error, res);
    }
};

/**
 * Controller untuk mengupdate resep berdasarkan user_id, menu_id, dan bahan_id
 */
export const updateMenuResep = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const menuId = req.menuId!;
        const bahanId = req.bahanId!;
        const result = await updateRecipeService(userId, menuId, bahanId, req.body);
        apiResponse.success(res, result);
    } catch (error) {
        handleHppError(error, res);
    }
};

/**
 * Controller untuk menghapus resep berdasarkan user_id, menu_id, dan bahan_id
 */
export const deleteMenuResep = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const menuId = req.menuId!;
        const bahanId = req.bahanId!;

        const result = await deleteRecipeService(userId, menuId, bahanId);
        apiResponse.success(res, result);
    } catch (error) {
        handleHppError(error, res);
    }
};