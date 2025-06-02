export interface BahanRequest {
  nama_bahan: string;
  harga_beli: number;
  jumlah: number;
  satuan: string;
  jumlah_digunakan: number;
  minimum_stock: number;
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
  data?: any;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      menuId?: string;
      bahanId?: string;
      BahanData?: BahanData;
    }
  }
}