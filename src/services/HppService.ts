import HppModel from "../models/hpp.model";
import { ApiError } from "../exceptions/ApiError";
import { BahanRequest, BahanUpdateRequest, HppResponse } from "../types/hpp.type";
import { calculateHpp } from "../utils/hppCalculate.util";
import MenuModel from "../models/menu.model";

/**
 * Service untuk menghitung total hpp menu
 */
export const updateTotalHPPService = async (menuId: string): Promise<void> => {
  const menuBahanItems = await HppModel.getMenuBahanCosts(menuId);
  const totalHpp = Math.round(
    menuBahanItems.reduce((acc: number, item: { biaya: number | null }) => acc + (item.biaya ?? 0), 0)
  );

  const menu = await MenuModel.findMenuById(menuId);
  if (!menu) {
    console.error(`Menu dengan ID ${menuId} tidak ditemukan saat mencoba update HPP.`);
    return;
  }

  let hargaJualBaru: number | null = menu.harga_jual ?? null;
  if (typeof menu.keuntungan === 'number' && menu.keuntungan >= 0) {
    hargaJualBaru = Math.round(totalHpp + (menu.keuntungan / 100) * totalHpp)
  }

  await HppModel.saveMenuCostAndPrive(menuId, totalHpp, hargaJualBaru);
}

/**
 * Service untuk menambah resep ke menu
 */
export const createRecipeService = async (
  userId: string,
  menuId: string,
  bahanData: BahanRequest
): Promise<HppResponse> => {
  const existingResep = await HppModel.existingResep(menuId, bahanData.nama_bahan);
  if (existingResep) {
    throw new ApiError("Bahan sudah ada", 409);
  }

  const biaya = Math.round(
    calculateHpp(bahanData.harga_beli, bahanData.jumlah_beli, bahanData.jumlah_digunakan)
  )

  await HppModel.createBahanWithMenuLink({
    userId,
    menuId,
    ...bahanData,
    biaya
  });

  await updateTotalHPPService(menuId);

  return {
    message: "Bahan berhasil ditambahkan"
  };
};

/**
 * Service untuk mendapatkan resep berdasarkan userId dan menuId
 */
export const getRecipesService = async (
  userId: string,
  menuId: string
): Promise<any[]> => {
  return await HppModel.findResepByUserIdAndMenuId(userId, menuId);
};

/**
 * Service untuk mengupdate resep dalam menu
 */
export const updateRecipeService = async (
  userId: string,
  menuId: string,
  bahanId: string,
  bahan: BahanUpdateRequest
): Promise<HppResponse> => {
  const biayaBaru = Math.round(
    calculateHpp(bahan.harga_beli, bahan.jumlah_beli, bahan.jumlah_digunakan)
  );

  const updated = await HppModel.updateMenuResep(userId, menuId, bahanId, {
    ...bahan,
    biayaBaru
  });

  if (!updated) {
    throw new ApiError("Resep gagal diperbarui", 400);
  }

  await updateTotalHPPService(menuId);

  return {
    message: "Bahan berhasil diperbarui"
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
  const deleted = await HppModel.deleteMenuResep(userId, menuId, bahanId);
  if (!deleted) {
    throw ApiError.badRequest("Bahan gagal dihapus");
  };

  await updateTotalHPPService(menuId);

  return {
    message: "Bahan berhasil dihapus"
  };
};