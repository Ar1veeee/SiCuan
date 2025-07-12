import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";

/**
 * Controller untuk menampilkan detail berdasarkan recipeId
 * @param req 
 * @param res 
 * @param next 
 */
export const getRecipeDetailController = () => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const recipeDetail = req.recipeItem;
        apiResponse.success(res, { recipe: recipeDetail })
    } catch (error) {
        next(error)
    }
}