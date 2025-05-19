export interface BahanRequest {
  nama_bahan: string;
  harga_beli: number;
  jumlah: number;
  satuan: string;
  jumlah_digunakan: number;
}

export interface BahanData extends BahanRequest {
  id: number;
  biaya?: number;
}

export interface HppResponse {
  message: string;
  data?: any;
}

export interface MenuHppData {
  id: number;
  menuId: number;
  bahanId: number;
  jumlah: number;
  harga_beli: number;
  satuan: string;
  biaya: number;
}

declare global {
    namespace Express {
        interface Request {
            userId?: number;
            menuId?: number;
            bahanId?: number;
            BahanData?: BahanData;
        }
    }
}