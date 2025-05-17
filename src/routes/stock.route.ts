import { Router } from "express";
const router = Router()
import {
    createStock,
    getStocks,
    updateStock,
    deleteStock
} from "../controllers/stock.controller";
import {
    validateUserId,
    validateStockId,
    verifyStockOwnership
} from '../middlewares/stock.middleware';
import verifyToken from "../middlewares/auth.middleware";
import verifyUserAccess from "../middlewares/userAccess.middleware";
import { validate } from "../middlewares/validate.middleware";
import { stockSchema } from "../validators/StockValidator";

router.use(verifyToken);

// Mengambil semua stok untuk user tertentu berdasarkan user_id
router.get(
    "/:user_id", 
    verifyUserAccess, 
    validateUserId, 
    getStocks
);

// Menambahkan stok untuk user tertentu berdasarkan user_id
router.post(
    "/:user_id",
    validate(stockSchema),
    verifyUserAccess,
    validateUserId,
    createStock
);

// Mengupdate stok untuk user tertentu berdasarkan user_id dan stock_id
router.put(
    "/:user_id/:stock_id", 
    validate(stockSchema), 
    verifyUserAccess,
    validateUserId,
    validateStockId,
    updateStock);

// Menghapus stok untuk user tertentu berdasarkan user_id dan stock_id
router.delete(
    "/:user_id/:stock_id", 
    verifyUserAccess, 
    validateUserId,
    validateStockId,
    deleteStock);

export default router;