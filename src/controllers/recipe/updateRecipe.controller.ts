import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { RecipeResponse, RecipeUpdateRequest } from "../../types/recipe.type";

/**
 * Controller untuk mengupdate resep berdasarkan userId, menuId, dan bahanId
 * @param req
 * @param res
 * @param next
 */
export const updateRecipeController =
  ({
    updateRecipeService,
  }: {
    updateRecipeService: (
      userId: string,
      menuId: string,
      recipeId: string,
      bahan: RecipeUpdateRequest
    ) => Promise<RecipeResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const menuId = req.menuId!;
      const recipeId = req.recipeId!;

      const result = await updateRecipeService(
        userId,
        menuId,
        recipeId,
        req.body
      );
      apiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
