import SalesModel from "../models/sales.model";
import { ApiError } from "../exceptions/ApiError";
import { CreateSalesRequest, SalesResponse, SalesSummaryResponse } from "../types/sales.type";
import MenuModel from "../models/menu.model";
import { calculateFinancials, validateStockAvailability } from "../utils/sales.utils";

export const getSalesSummaryService = async (userId: string) => {
    const summaryData = await SalesModel.getSummary(userId);
    return summaryData;
}

export const getSalesService = async (userId: string, startDate: string, endDate: string): Promise<SalesSummaryResponse[]> => {
    const today = new Date();
    const defaultStart = new Date(today.setHours(0, 0, 0, 0));
    const defaultEnd = new Date(today.setHours(23, 59, 59, 999));

    const start = startDate ? new Date(startDate) : defaultStart;
    const end = endDate ? new Date(endDate) : defaultEnd;

    const salesList = await SalesModel.findSalesByDate(userId, start, end);
    return salesList.map(sales => ({
        id: sales.id,
        userId: sales.userId,
        nama_menu: sales.menu.nama_menu,
        laku: sales.jumlah_laku,
        income: sales.income || 0,
        profit: sales.profit || 0,
    }));
}

export const createSalesService = async (
    userId: string,
    data: CreateSalesRequest,
): Promise<SalesResponse> => {
    const menu = await MenuModel.findMenuByNameWithBahan(userId, data.nama_menu)
    if (!menu) {
        throw ApiError.notFound(`Menu dengan nama ${data.nama_menu} tidak ditemukan.`)
    }

    await validateStockAvailability(menu, data.jumlah_laku);
    const financials = calculateFinancials(menu, data.jumlah_laku);

    const salesData = {
        ...data,
        ...financials
    }
    const recipe = menu.bahanList

    await SalesModel.executeSalesTransaction(userId, menu.id!, salesData, recipe)

    return {
        message: "Penjualan berhasil disimpan",
    }
}

export const deleteSalesService = async (userId: string, salesId: string):Promise<SalesResponse> => {
    await SalesModel.deleteSalesByIdAndUserId(userId, salesId)

    return {
        message: "Penjualan berhasil terhapus"
    }
}