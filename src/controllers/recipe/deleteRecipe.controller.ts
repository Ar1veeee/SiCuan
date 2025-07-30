import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { RecipeResponse } from "../../types/recipe.type";

/**
 * Controller untuk menghapus resep berdasarkan userId, menuId, dan bahanId
 * @param req
 * @param res
 * @param next
 */
export const deleteRecipeController =
  ({
    deleteRecipeService,
  }: {
    deleteRecipeService: (
      userId: string,
      menuId: string,
      recipeId: string
    ) => Promise<RecipeResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const menuId = req.menuId!;
      const recipeId = req.recipeId!;

      const result = await deleteRecipeService(userId, menuId, recipeId);
      apiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
