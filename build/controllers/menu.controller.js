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
exports.deleteMenu = exports.updateMenu = exports.getMenus = exports.createMenu = void 0;
const apiResponse_util_1 = require("../utils/apiResponse.util");
const MenuService_1 = require("../services/MenuService");
const menu_model_1 = __importDefault(require("../models/menu.model"));
const apiError_1 = require("../exceptions/apiError");
// Controller untuk menambah menu
const createMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { nama_menu } = req.body;
    if (!user_id || !nama_menu) {
        apiResponse_util_1.apiResponse.badRequest(res, "Data yang dibutuhkan tidak dapat ditemukan");
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        const result = yield (0, MenuService_1.createMenuService)(userId, nama_menu);
        apiResponse_util_1.apiResponse.created(res, result);
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
exports.createMenu = createMenu;
// Controller untuk mendapatkan menu berdasarkan user_id
const getMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    if (!user_id) {
        apiResponse_util_1.apiResponse.badRequest(res, "Data yang diperlukan tidak dapat ditemukan");
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        const menus = yield menu_model_1.default.findMenusByUserId(userId);
        apiResponse_util_1.apiResponse.success(res, { menus });
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
exports.getMenus = getMenus;
// Controller untuk memperbarui menu
const updateMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, menu_id } = req.params;
    const { nama_menu } = req.body;
    if (!user_id || !menu_id) {
        apiResponse_util_1.apiResponse.badRequest(res, "Data yang diperlukan tidak ditemukan");
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const updatedMenu = yield (0, MenuService_1.updateMenuService)(userId, menuId, nama_menu);
        apiResponse_util_1.apiResponse.success(res, updatedMenu);
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
exports.updateMenu = updateMenu;
const deleteMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, menu_id } = req.params;
    if (!user_id || !menu_id) {
        apiResponse_util_1.apiResponse.badRequest(res, "Data yang diperlukan tidak ditemukan");
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        const menuId = parseInt(menu_id, 10);
        const result = yield (0, MenuService_1.deleteMenuService)(userId, menuId);
        apiResponse_util_1.apiResponse.success(res, result);
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
exports.deleteMenu = deleteMenu;
