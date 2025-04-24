"use strict";

import { Request, Response } from "express";
import { apiResponse } from "../utils/ApiResponseUtil";
import { addUserResep, deleteUserMenuResep, updateUserMenuResep } from "../services/HppService";
import Hpp from "../models/HppModel";

export const createResep = async (req: Request, res: Response): Promise<any> => {
    const { user_id, menu_id } = (req.params);
    const bahan = req.body;

    if (!user_id && menu_id) {
        return apiResponse.badRequest(
            res,
            "Data yang dibutuhkan tidak dapat ditemukan"
        )
    }

    try {
        const userId = Number(user_id);
        const menuId = Number(menu_id);
        const addResep = await addUserResep(userId, menuId, bahan)
        return apiResponse.created(
            res,
            addResep
        )
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}

export const Recipes = async (req: Request, res: Response): Promise<any> => {
    const { user_id, menu_id } = req.params;
    if (!user_id || !menu_id) {
        return apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak dapat ditemukan"
        )
    }

    try {
        const userId = Number(user_id)
        const menuId = Number(menu_id)
        const recipes = await Hpp.findResepByUserIdAndMenuId(userId, menuId)
        return apiResponse.success(res, recipes)
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}

export const deleteMenuResep = async (req: Request, res: Response): Promise<any> => {
    const { user_id, menu_id, bahan_id } = req.params
    if (!user_id || !menu_id || !bahan_id) {
        return apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak ditemukan"
        )
    }
    try {
        const userId = Number(user_id);
        const menuId = Number(menu_id);
        const bahanId = Number(bahan_id);
        const result = await deleteUserMenuResep(userId, menuId, bahanId)
        return apiResponse.success(res, result)
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}

export const updateMenuResep = async (req: Request, res: Response): Promise<any> => {
    const { user_id, menu_id, bahan_id } = req.params
    const bahan = req.body

    if (!user_id || !menu_id || !bahan_id) {
        return apiResponse.badRequest(
            res,
            "Data yang diperlukan tidak ditemukan"
        )
    }

    try {
        const userId = Number(user_id);
        const menuId = Number(menu_id);
        const bahanId = Number(bahan_id);

        const updated = await updateUserMenuResep(userId, menuId, bahanId, bahan)

        return apiResponse.success(res, updated)
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}