export enum JenisTransaksi {
    MASUK = 'Masuk',
    KELUAR = 'Keluar',
    PENYESUAIAN = 'Penyesuaian'
}

export interface StockData {
    id: string;
    userId: string;
    nama: string;
    jumlah: number;
    jenis_transaksi: JenisTransaksi;
    keterangan: string;
    tanggal?: string;
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
            userId?: string;
            stockId?: string;
            stockData?: StockData;
        }
    }
}