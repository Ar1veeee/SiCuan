export interface PenjualanData {
    id: string;
    userId: string;
    menuId: string;
    harga_jual: number;
    jumlah_laku: number;
    income: number;
    profit: number;
    keterangan: string;
    createdAt: Date;
    updateAt: Date;
}

export interface PenjualanRequest {
    nama_menu: string;
    jumlah_hpp: number;
    harga_jual: number;
    jumlah_laku:string;
    keterangan: string;
}

export interface PenjualanResponse {
    message: string;
    data?: object;
}

declare global{
    namespace Express{
        interface Request {
            userId?: string;
            menuId?: string;
            penjualanData?: PenjualanData;
        }
    }
}