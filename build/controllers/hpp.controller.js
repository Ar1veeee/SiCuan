"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenuResep = exports.updateMenuResep = exports.getRecipes = exports.createResep = void 0;
const apiResponse_util_1 = require("../utils/apiResponse.util");
const HppService_1 = require("../services/HppService");
const hpp_model_1 = __importDefault(require("../models/hpp.model"));
const apiError_1 = require("../exceptions/apiError");
// Controller untuk menambah resep
const createResep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, menu_id } = req.params;
    const bahan = req.body;
    if (!user_id || !menu_id) {
        apiResponse_util_1.apiResponse.badRequest(res, "Data yang dibutuhkan tidak dapat ditemukan");
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const addResep = yield (0, HppService_1.createRecipeService)(userId, menuId, bahan);
        apiResponse_util_1.apiResponse.created(res, addResep);
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.createResep = createResep;
// Controller untuk mendapatkan resep berdasarkan user_id dan menu_id
const getRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, menu_id } = req.params;
    if (!user_id || !menu_id) {
        apiResponse_util_1.apiResponse.badRequest(res, "Data yang diperlukan tidak dapat ditemukan");
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const recipes = yield hpp_model_1.default.findResepByUserIdAndMenuId(userId, menuId);
        apiResponse_util_1.apiResponse.success(res, recipes);
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.getRecipes = getRecipes;
// Controller untuk mengupdate resep berdasarkan user_id, menu_id, dan bahan_id
const updateMenuResep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, menu_id, bahan_id } = req.params;
    const bahan = req.body;
    if (!user_id || !menu_id || !bahan_id) {
        apiResponse_util_1.apiResponse.badRequest(res, "Data yang diperlukan tidak ditemukan");
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const bahanId = parseInt(bahan_id, 10);
        const updatedRecipe = yield (0, HppService_1.updateRecipeService)(userId, menuId, bahanId, bahan);
        apiResponse_util_1.apiResponse.success(res, updatedRecipe);
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.updateMenuResep = updateMenuResep;
// Controller untuk menghapus resep berdasarkan user_id, menu_id, dan bahan_id
const deleteMenuResep = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, menu_id, bahan_id } = req.params;
    if (!user_id || !menu_id || !bahan_id) {
        apiResponse_util_1.apiResponse.badRequest(res, "Data yang diperlukan tidak ditemukan");
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const bahanId = parseInt(bahan_id, 10);
        const deletedRecipe = yield (0, HppService_1.deleteRecipeService)(userId, menuId, bahanId);
        apiResponse_util_1.apiResponse.success(res, deletedRecipe);
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.deleteMenuResep = deleteMenuResep;
