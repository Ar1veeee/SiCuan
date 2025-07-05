import { Menu, Bahan, MenuBahan } from "@prisma/client";


export interface CreateSalesRequest {
    nama_menu: string;
    tanggal: string | Date;
    jumlah_laku: number;
    keterangan?: string;
}

export interface SalesResponse {
    message: string;
    data?: object;
}

export interface SalesSummaryResponse {
    id: string;
    userId: string;
    nama_menu: string;
    laku: number;
    income: number;
    profit: number;
    createdAt?: string;
    updatedAt?: string;
}

export type MenuWithRecipe = Menu & {
    bahanList: (MenuBahan & { bahan: Bahan })[];
};