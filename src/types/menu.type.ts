export interface MenuRequest {
    nama_menu: string;
}

export interface MenuData {
    id: number;
    userId: number;
    nama_menu: string;  
    jumlah_hpp?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
    createdAtFormatted?: string;
    updatedAtFormatted?: string;
}

export interface MenuResponse {
    message: string;
    data?: any;
}

declare global {
    namespace Express {
        interface Request {
            userId?: number;
            menuId?: number;
            menuData?: MenuData;
        }
    }
}