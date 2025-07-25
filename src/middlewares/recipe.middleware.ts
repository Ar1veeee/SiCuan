import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/ApiError';
import { isValidULID } from '../validators/ulid.validator';
import HppModel from '../models/recipe.model';

export const validateMenuId = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { menu_id } = req.params;

        if (!menu_id) {
            throw ApiError.badRequest("Menu ID diperlukan");
        }

        if (!isValidULID(menu_id)) {
            throw ApiError.badRequest("Format Menu ID tidak valid");
        }
        req.menuId = menu_id;
        next();
    } catch (error) {
        next(error)
    }

};

export const validateBahanId = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { bahan_id } = req.params;

        if (!bahan_id || !isValidULID(bahan_id)) {
            throw ApiError.badRequest("Format Bahan ID tidak valid atau tidak ada.");
        }

        req.bahanId = bahan_id;
        next();
    } catch (error) {
        next(error)
    }
};

export const validateRecipeId = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { recipe_id } = req.params;

        if (!recipe_id || !isValidULID(recipe_id)) {
            throw ApiError.badRequest("Format Bahan ID tidak valid atau tidak ada.");
        }

        req.recipeId = recipe_id;
        next();
    } catch (error) {
        next(error)
    }
};

export const verifyAndAttachRecipeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, menuId, recipeId } = req;

        if (!userId || !menuId || !recipeId) {
            throw ApiError.badRequest("Informasi User, Menu, atau Bahan tidak lengkap.");
        }
        
        const recipeItem = await HppModel.findResepDetail(recipeId, userId, menuId, )

        if (!recipeItem) {
            throw ApiError.notFound("Detail resep tidak ditemukan atau Anda tidak memiliki akses.");
        }

        req.recipeItem = recipeItem;
        
        next();
    } catch (error) {
        next(error);
    }
};