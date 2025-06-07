export interface MenuRequest {
    nama_menu: string;
}

export interface MenuData {
    id: string;
    userId: string;
    nama_menu: string;  
    hpp?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MenuResponse {
    message: string;
    data?: object;
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            menuId?: string;
            menuData?: MenuData;
        }
    }
}