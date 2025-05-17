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
exports.updateRecipeService = exports.deleteRecipeService = exports.createRecipeService = void 0;
const hpp_model_1 = __importDefault(require("../models/hpp.model"));
const apiError_1 = require("../exceptions/apiError");
const UserValidator_1 = require("../validators/UserValidator");
const MenuValidator_1 = require("../validators/MenuValidator");
const createRecipeService = (userId, menuId, bahan) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    yield (0, MenuValidator_1.validateMenuOwnership)(userId, menuId);
    const existing = yield hpp_model_1.default.existingResep(menuId, bahan.nama_bahan);
    if (existing) {
        throw new apiError_1.ApiError("Resep sudah ada", 400);
    }
    yield hpp_model_1.default.createBahanWithMenuLink({
        nama: bahan.nama_bahan,
        harga_beli: bahan.harga_beli,
        jumlah: bahan.jumlah,
        satuan: bahan.satuan,
        menuId,
        jumlah_digunakan: bahan.jumlah_digunakan,
        userId, // Pass the userId to the model function
    });
    yield hpp_model_1.default.updateTotalHPP(menuId);
    return { message: "Resep Berhasil Ditambahkan" };
});
exports.createRecipeService = createRecipeService;
const deleteRecipeService = (userId, menuId, bahanId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    const deleted = yield hpp_model_1.default.deleteMenuResep(userId, menuId, bahanId);
    if (!deleted) {
        throw new apiError_1.ApiError("Bahan gagal dihapus", 400);
    }
    return { message: "Bahan Berhasil Dihapus" };
});
exports.deleteRecipeService = deleteRecipeService;
const updateRecipeService = (userId, menuId, bahanId, bahan) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, UserValidator_1.validateUserExists)(userId);
    yield (0, MenuValidator_1.validateMenuOwnership)(userId, menuId);
    const updated = yield hpp_model_1.default.updateMenuResep(userId, menuId, bahanId, {
        nama: bahan.nama_bahan,
        harga_beli: bahan.harga_beli,
        jumlah: bahan.jumlah,
        satuan: bahan.satuan,
        menuId,
        jumlah_digunakan: bahan.jumlah_digunakan,
    });
    if (!updated) {
        throw new apiError_1.ApiError("Resep Gagal Diperbarui", 400);
    }
    yield hpp_model_1.default.updateTotalHPP(menuId);
    return { message: "Resep Berhasil Diperbarui" };
});
exports.updateRecipeService = updateRecipeService;
