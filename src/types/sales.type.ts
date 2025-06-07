export interface SalesData {
    id: string;
    userId: string;
    menuId: string;
    nama_menu: string;
    tanggal: string;
    harga_jual: number;
    jumlah_laku: number;
    hpp: number;
    income: number;
    profit: number;
    keterangan?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SalesRequest {
    nama_menu: string;
    tanggal: string;
    hpp: number;
    harga_jual: number;
    jumlah_laku: number;
    keterangan?: string;
}

export interface SalesResponse {
    message: string;
    data?: object;
}

declare global {
    namespace Express{
        interface Request {
            userId?: string;
            menuId?: string;
            salesId?: string;
            salesData?: SalesData;
        }
    }
}