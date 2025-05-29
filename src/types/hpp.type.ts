export interface BahanRequest {
  nama_bahan: string;
  harga_beli: number;
  jumlah: number;
  satuan: string;
  jumlah_digunakan: number;
}

export interface BahanData extends BahanRequest {
  id: string;
  biaya?: number;
}

export interface HppResponse {
  message: string;
  data?: any;
}

export interface MenuHppData {
  id: string;
  menuId: string;
  bahanId: string;
  jumlah: number;
  harga_beli: number;
  satuan: string;
  biaya: number;
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