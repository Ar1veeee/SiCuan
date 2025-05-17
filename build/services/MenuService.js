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
exports.deleteMenuService = exports.updateMenuService = exports.createMenuService = void 0;
const menu_model_1 = __importDefault(require("../models/menu.model"));
const apiError_1 = require("../exceptions/apiError");
const UserValidator_1 = require("../validators/UserValidator");
const MenuValidator_1 = require("../validators/MenuValidator");
const library_1 = require("@prisma/client/runtime/library");
const createMenuService = (userId, nama_menu) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    const existingMenu = yield menu_model_1.default.findExistingMenu(userId, nama_menu);
    if (existingMenu) {
        throw new apiError_1.ApiError("Menu sudah dipakai", 400);
    }
    try {
        yield menu_model_1.default.addMenu(userId, nama_menu);
        return { message: "Menu Berhasil Ditambahkan" };
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError) {
            throw new apiError_1.ApiError("Gagal menyimpan data menu", 500);
        }
        throw error;
    }
});
exports.createMenuService = createMenuService;
const updateMenuService = (userId, menuId, nama_menu) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    yield (0, MenuValidator_1.validateMenuOwnership)(userId, menuId);
    try {
        yield menu_model_1.default.updateUserMenu(userId, menuId, nama_menu);
        return { message: "Menu Berhasil Diperbarui" };
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError) {
            throw new apiError_1.ApiError("Gagal memperbarui data menu", 500);
        }
        throw error;
    }
});
exports.updateMenuService = updateMenuService;
const deleteMenuService = (userId, menuId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    yield (0, MenuValidator_1.validateMenuOwnership)(userId, menuId);
    try {
        yield menu_model_1.default.deleteUserMenu(userId, menuId);
        return { message: "Menu Berhasil Dihapus" };
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError) {
            throw new apiError_1.ApiError("Gagal menghapus data menu", 500);
        }
        throw error;
    }
});
exports.deleteMenuService = deleteMenuService;
