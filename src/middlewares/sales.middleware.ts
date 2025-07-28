import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/ApiError";
import { isValidULID } from "../validators/ulid.validator";
import SalesModel from "../models/sales.model";

export const validateSalesId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { sales_id } = req.params;
    if (!sales_id || !isValidULID(sales_id)) {
      throw ApiError.badRequest("Format Bahan ID tidak valid atau tidak ada.");
    }
    req.salesId = sales_id;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAndAttachSalesItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId || !req.salesId) {
      throw ApiError.badRequest("ID User, atau Sales tidak tersedia.");
    }

    const salesData = await SalesModel.findSalesByIdAndUserId(
      req.userId,
      req.salesId
    );

    if (!salesData) {
      throw ApiError.notFound(
        "Data penjualan tidak ditemukan atau anda tidak memiliki akses"
      );
    }

    req.salesData = salesData;

    next();
  } catch (error) {
    next(error);
  }
};
