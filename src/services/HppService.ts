import HppModel from "../models/hpp.model";
import { ApiError } from "../exceptions/ApiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateMenuOwnership } from "../validators/MenuValidator";
import { BahanRequest, HppResponse } from "../types/hpp.type";

/**
 * Service untuk menambahkan resep baru ke menu
 */
export const createRecipeService = async (
  userId: string,
  menuId: string,
  bahan: BahanRequest
): Promise<HppResponse> => {
  await validateUserExists(userId);
  await validateMenuOwnership(userId, menuId);

  const existing = await HppModel.existingResep(menuId, bahan.nama_bahan);
  if (existing) {
    throw new ApiError("Resep sudah ada", 400);
  }

  await HppModel.createBahanWithMenuLink({
    nama: bahan.nama_bahan,
    harga_beli: bahan.harga_beli,
    jumlah: bahan.jumlah,
    satuan: bahan.satuan,
    menuId,
    jumlah_digunakan: bahan.jumlah_digunakan,
    userId,
  });

  await HppModel.updateTotalHPP(menuId);

  return {
    message: "Resep berhasil ditambahkan"
  };
};

/**
 * Service untuk mendapatkan resep berdasarkan userId dan menuId
 */
export const getRecipesService = async (
  userId: string,
  menuId: string
): Promise<any[]> => {
  await validateUserExists(userId);
  await validateMenuOwnership(userId, menuId);

  const recipes = await HppModel.findResepByUserIdAndMenuId(userId, menuId);

  return recipes;
};

/**
 * Service untuk mengupdate resep dalam menu
 */
export const updateRecipeService = async (
  userId: string,
  menuId: string,
  bahanId: string,
  bahan: BahanRequest
): Promise<HppResponse> => {
  await validateUserExists(userId);
  await validateMenuOwnership(userId, menuId);

  const updated = await HppModel.updateMenuResep(userId, menuId, bahanId, {
    nama: bahan.nama_bahan,
    harga_beli: bahan.harga_beli,
    jumlah: bahan.jumlah,
    satuan: bahan.satuan,
    menuId,
    jumlah_digunakan: bahan.jumlah_digunakan,
  });

  if (!updated) {
    throw new ApiError("Resep gagal diperbarui", 400);
  }

  await HppModel.updateTotalHPP(menuId);

  return {
    message: "Resep berhasil diperbarui"
  };
};

/**
 * Service untuk menghapus resep dari menu
 */
export const deleteRecipeService = async (
  userId: string,
  menuId: string,
  bahanId: string
): Promise<HppResponse> => {
  await validateUserExists(userId);
  await validateMenuOwnership(userId, menuId);

  const deleted = await HppModel.deleteMenuResep(userId, menuId, bahanId);
  if (!deleted) {
    throw new ApiError("Bahan gagal dihapus", 400);
  }

  return {
    message: "Bahan berhasil dihapus"
  };
};