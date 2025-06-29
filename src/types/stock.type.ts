import { Bahan, StockTransaction } from '@prisma/client';

export interface CreateStockTransactionRequest {
    nama_bahan: string;
    satuan: string;
    minimum_stock: number;
    jumlah: number;
    jenis_transaksi: 'PEMBELIAN' | 'PENJUALAN' | 'PENYESUAIAN';
    keterangan?: string;
}

export interface StockSummaryResponse {
    id: string;
    userId: string;
    nama_bahan: string;
    jumlah: number;
    satuan: string | null;
    minimum_stock: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface StockTransactionInfo {
    jenis_transaksi: string;
    jumlah: number; 
    keterangan: string | null;
    createdAt: string;
}

export interface StockDetailResponse extends StockSummaryResponse {
    transactions: StockTransactionInfo[];
}

export type BahanWithTransactions = Bahan & {
    stockTransactions: StockTransaction[];
};

export interface DefaultStockResponse {
    message: string;
    data?: object;
}