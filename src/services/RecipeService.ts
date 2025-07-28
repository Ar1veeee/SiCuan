import HppModel from "../models/recipe.model";
import { ApiError } from "../exceptions/ApiError";
import {
  RecipeRequest,
  RecipeUpdateRequest,
  RecipeResponse,
  RecipeData,
} from "../types/recipe.type";
import { calculateHpp } from "../utils/hppCalculate.util";
import MenuModel from "../models/menu.model";

/**
 * Service untuk menghitung total hpp menu
 */
export const updateTotalHPPService = async (menuId: string): Promise<void> => {
  const menuBahanItems = await HppModel.getMenuBahanCosts(menuId);
  const totalHpp = Math.round(
    menuBahanItems.reduce(
      (acc: number, item: { biaya: number | null }) => acc + (item.biaya ?? 0),
      0
    )
  );

  const menu = await MenuModel.findMenuById(menuId);
  if (!menu) {
    console.error(
      `Menu dengan ID ${menuId} tidak ditemukan saat mencoba update HPP.`
    );
    return;
  }

  let hargaJualBaru: number | null = menu.harga_jual ?? null;
  if (typeof menu.keuntungan === "number" && menu.keuntungan >= 0) {
    hargaJualBaru = Math.round(totalHpp + (menu.keuntungan / 100) * totalHpp);
  }

  await HppModel.saveMenuCostAndPrive(menuId, totalHpp, hargaJualBaru);
};

/**
 * Service untuk menambah resep ke menu
 */
export const createRecipeService = async (
  userId: string,
  menuId: string,
  bahanData: RecipeRequest
): Promise<RecipeResponse> => {
  const existingResep = await HppModel.existingResep(
    menuId,
    bahanData.nama_bahan
  );
  if (existingResep) {
    throw new ApiError("Resep sudah ada", 409);
  }

  const biaya = Math.round(
    calculateHpp(
      bahanData.harga_beli,
      bahanData.jumlah_beli,
      bahanData.jumlah_digunakan
    )
  );

  await HppModel.createBahanWithMenuLink({
    userId,
    menuId,
    ...bahanData,
    biaya,
  });

  await updateTotalHPPService(menuId);

  return {
    message: "Bahan berhasil ditambahkan",
  };
};

/**
 * Service untuk mendapatkan resep berdasarkan userId dan menuId
 */
export const getRecipesService = async (
  userId: string,
  menuId: string
): Promise<RecipeData[]> => {
  const rawRecipes = await HppModel.findResepByUserIdAndMenuId(userId, menuId);
  const mappedRecipes: RecipeData[] = rawRecipes.map((item) => ({
    id: item.id,
    menuId: item.menuId,
    bahanId: item.bahanId,
    nama_bahan: item.bahan.nama_bahan,
    harga_beli: item.harga_beli ?? undefined,
    jumlah_beli: item.jumlah_beli,
    satuan: item.bahan?.satuan ?? undefined,
    jumlah_digunakan: item.jumlah_digunakan ?? undefined,
    biaya: item.biaya ?? undefined,
  }));

  return mappedRecipes;
};

/**
 * Service untuk mengupdate resep dalam menu
 */
export const updateRecipeService = async (
  userId: string,
  menuId: string,
  bahanId: string,
  bahan: RecipeUpdateRequest
): Promise<RecipeResponse> => {
  const biayaBaru = Math.round(
    calculateHpp(bahan.harga_beli, bahan.jumlah_beli, bahan.jumlah_digunakan)
  );

  const updated = await HppModel.updateMenuResep(userId, menuId, bahanId, {
    ...bahan,
    biayaBaru,
  });

  if (!updated) {
    throw new ApiError("Resep gagal diperbarui", 400);
  }

  await updateTotalHPPService(menuId);

  return {
    message: "Bahan berhasil diperbarui",
  };
};

/**
 * Service untuk menghapus resep dari menu
 */
export const deleteRecipeService = async (
  userId: string,
  menuId: string,
  bahanId: string
): Promise<RecipeResponse> => {
  const deleted = await HppModel.deleteMenuResep(userId, menuId, bahanId);
  if (!deleted) {
    throw ApiError.badRequest("Bahan gagal dihapus");
  }

  await updateTotalHPPService(menuId);

  return {
    message: "Bahan berhasil dihapus",
  };
};
