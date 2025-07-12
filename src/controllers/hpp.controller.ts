import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import {
    createRecipeService,
    getRecipesService,
    deleteRecipeService,
    updateRecipeService
} from "../services/RecipeService";

/**
 * Controller untuk menambah resep berdasarkan userId dan menuId
 * @param req 
 * @param res 
 * @param next 
 */
export const createResep = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {   
        const userId = req.userId!;
        const menuId = req.menuId!;

        const result = await createRecipeService(userId, menuId, req.body);
        apiResponse.created(res, result);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk mendapatkan resep berdasarkan userId dan menuId
 * @param req 
 * @param res 
 * @param next
 */
export const getRecipes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId!;
        const menuId = req.menuId!;

        const recipes = await getRecipesService(userId, menuId);
        apiResponse.success(res, { recipes });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk menampilkan detail berdasarkan recipeId
 * @param req 
 * @param res 
 * @param next 
 */
export const getRecipeDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recipeDetail = req.recipeItem;
        apiResponse.success(res, { recipe: recipeDetail })
    } catch (error) {
        next(error)
    }
}

/**
 * Controller untuk mengupdate resep berdasarkan userId, menuId, dan bahanId
 */
export const updateMenuResep = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId!;        
        const menuId = req.menuId!;
        const bahanId = req.bahanId!;
        
        const result = await updateRecipeService(userId, menuId, bahanId, req.body);
        apiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk menghapus resep berdasarkan userId, menuId, dan bahanId
 */
export const deleteMenuResep = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId!;
        const menuId = req.menuId!;
        const bahanId = req.bahanId!;

        const result = await deleteRecipeService(userId, menuId, bahanId);
        apiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
};