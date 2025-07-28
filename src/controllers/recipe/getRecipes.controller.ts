import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { RecipeData } from "../../types/recipe.type";

/**
 * Controller untuk mendapatkan resep berdasarkan userId dan menuId
 * @param req
 * @param res
 * @param next
 */
export const getRecipesController =
  ({
    getRecipesService,
  }: {
    getRecipesService: (userId: string, menuId: string) => Promise<RecipeData>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const menuId = req.menuId!;

      const recipes = await getRecipesService(userId, menuId);
      apiResponse.success(res, { recipes });
    } catch (error) {
      next(error);
    }
  };
