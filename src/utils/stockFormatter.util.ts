import { StockDetailResponse, StockTransactionInfo, BahanWithTransactions } from "../types/stock.type";

export const formatStockDetailResponse = (bahanData: BahanWithTransactions): StockDetailResponse => {
    const formattedTransactions: StockTransactionInfo[] =
        bahanData.stockTransactions.map(tx => ({
            id: tx.id,
            jenis_transaksi: tx.jenis_transaksi,
            jumlah: tx.jumlah,
            keterangan: tx.keterangan,
            createdAt: new Date(tx.createdAt).toLocaleDateString("id-ID", {
                year: "numeric", month: "long", day: "numeric",
                hour: "2-digit", minute: "2-digit",
                timeZone: "Asia/Jakarta"
            })
        }));

    const formattedStockDetail: StockDetailResponse = {
        id: bahanData.id,
        userId: bahanData.userId,
        nama_bahan: bahanData.nama_bahan,
        jumlah: bahanData.jumlah,
        satuan: bahanData.satuan,
        minimum_stock: bahanData.minimum_stock,
        createdAt: new Date(bahanData.createdAt).toLocaleDateString("id-ID", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
            timeZone: "Asia/Jakarta"
        }),
        updatedAt: new Date(bahanData.updatedAt).toLocaleDateString("id-ID", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
            timeZone: "Asia/Jakarta"
        }),
        transactions: formattedTransactions
    };

    return formattedStockDetail;
};