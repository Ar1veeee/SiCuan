export interface RecipeRequest {
  nama_bahan: string;
  harga_beli: number;
  jumlah_beli: number;
  satuan: string;
  jumlah_digunakan: number;
  biaya: number;
}

export interface RecipeUpdateRequest {
  harga_beli: number;
  jumlah_beli: number;
  jumlah_digunakan: number;
  biayaBaru: number;
}

export interface RecipeData {
  id: string;
  menuId: string;
  bahanId: string;
  nama_bahan: string;
  harga_beli?: number;
  jumlah_beli: number;
  satuan?: string;
  jumlah_digunakan?: number;
  biaya?: number;
}

export interface RecipeResponse {
  message: string;
  data?: object;
}
