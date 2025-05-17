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
exports.menuSchema = exports.validateMenuOwnership = void 0;
const menu_model_1 = __importDefault(require("../models/menu.model"));
const apiError_1 = require("../exceptions/apiError");
const zod_1 = require("zod");
const validateMenuOwnership = (userId, menuId) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(menuId)) {
        throw new apiError_1.ApiError("Menu ID tidak valid", 400);
    }
    const menu = yield menu_model_1.default.findMenuByIdAndUserId(userId, menuId);
    if (!menu) {
        throw new apiError_1.ApiError("Menu tidak dapat ditemukan", 400);
    }
    return menu;
});
exports.validateMenuOwnership = validateMenuOwnership;
exports.menuSchema = zod_1.z.object({
    nama_menu: zod_1.z.string().nonempty('Nama menu wajib diisi')
});
