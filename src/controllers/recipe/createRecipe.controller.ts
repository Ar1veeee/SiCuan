import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { RecipeRequest, RecipeResponse } from "../../types/recipe.type";

/**
 * Controller untuk menambah resep berdasarkan userId dan menuId
 * @param req
 * @param res
 * @param next
 */
export const createRecipeController =
  ({
    createRecipeService,
  }: {
    createRecipeService: (
      userId: string,
      menuId: string,
      bahanData: RecipeRequest
    ) => Promise<RecipeResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const menuId = req.menuId!;

      const result = await createRecipeService(userId, menuId, req.body);
      apiResponse.created(res, result);
    } catch (error) {
      next(error);
    }
  };
