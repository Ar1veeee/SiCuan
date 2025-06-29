import { JwtPayload } from "jsonwebtoken";

type RecipeItemWithBahan = MenuBahan & {
    bahan: {
        nama_bahan: string;
        satuan: string | null;
    }
};

type OtpEntryData = PasswordReset;

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            userId?: string;

            menuId?: string;
            bahanId?: string;
            stockId?: string;
            
            otpEntry?: OtpEntryData;            
            menu?: MenuData;
            bahanData?: BahanData;
            recipeItem?: RecipeItemWithBahan;
            stockData?: StockData;
        }
    }
}