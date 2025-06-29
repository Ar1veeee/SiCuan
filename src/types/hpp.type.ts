export interface BahanRequest {
  nama_bahan: string;
  harga_beli: number;
  jumlah_beli: number;
  satuan: string;
  jumlah_digunakan: number;
  biayaBaru: number;
}

export interface BahanUpdateRequest {
  harga_beli: number;
  jumlah_beli: number;
  jumlah_digunakan: number;
  biayaBaru: number;
}

export interface BahanData extends BahanRequest {
  id: string;
  userId: string;
  biaya?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HppResponse {
  message: string;
  data?: object;
}
