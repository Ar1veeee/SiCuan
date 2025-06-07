export enum JenisTransaksi {
    MASUK = 'Masuk',
    KELUAR = 'Keluar',
    PENYESUAIAN = 'Penyesuaian'
}

export interface StockData {
    id: string;
    userId: string;
    bahanId: string;
    nama_bahan: string;
    jumlah: number;
    jenis_transaksi: JenisTransaksi;
    keterangan: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StockRequest {
    jumlah: number;
    jenis_transaksi: JenisTransaksi | string;
    keterangan: string;
}

export interface StockResponse {
    message: string;
    data?: object;
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            stockId?: string;
            bahanId?: string;
            stockData?: StockData;
        }
    }
}