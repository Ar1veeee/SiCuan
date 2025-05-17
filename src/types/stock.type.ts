export enum JenisTransaksi {
    MASUK = 'Masuk',
    KELUAR = 'Keluar',
    PENYESUAIAN = 'Penyesuaian'
}

export interface StockData {
    id: number;
    userId: number;
    nama: string;
    jumlah: number;
    jenis_transaksi: JenisTransaksi;
    keterangan: string;
    tanggal?: Date;
}

export interface StockRequest {
    nama: string;
    jumlah: number;
    jenis_transaksi: JenisTransaksi | string;
    keterangan: string;
}

export interface StockResponse {
    message: string;
    data?: any;
}

declare global {
    namespace Express {
        interface Request {
            userId?: number;
            stockId?: number;
            stockData?: StockData;
        }
    }
}