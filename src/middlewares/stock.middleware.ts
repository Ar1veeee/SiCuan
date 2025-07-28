import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/ApiError";
import { isValidULID } from "../validators/ulid.validator";
import StockModel from "../models/stock.model";

export const validateBahanId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { bahan_id } = req.params;
    if (!bahan_id || !isValidULID(bahan_id)) {
      throw ApiError.badRequest("Format Bahan ID tidak valid atau tidak ada.");
    }
    req.bahanId = bahan_id;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAndAttachBahan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId || !req.bahanId) {
      throw ApiError.badRequest("ID User atau Bahan tidak tersedia.");
    }

    const bahan = await StockModel.findBahanByIdAndUserId(
      req.userId,
      req.bahanId
    );
    if (!bahan) {
      throw ApiError.notFound(
        "Bahan tidak ditemukan atau Anda tidak memiliki akses."
      );
    }

    req.bahanData = bahan;
    next();
  } catch (error) {
    next(error);
  }
};
