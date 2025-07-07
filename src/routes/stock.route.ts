import { Router } from "express";
const router = Router();
import { 
    getStocks, 
    getStockDetail,
    createStockTransaction,
    deleteStockBahan, 
} from "../controllers/stock.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateBahanId, verifyAndAttachBahan } from "../middlewares/stock.middleware";
import { stockSchema } from "../validators/stock.validator";
import verifyToken from "../middlewares/auth.middleware";


router.use(verifyToken);

router.get(
    "/", 
    getStocks
);

router.get(
    "/:bahan_id", 
    validateBahanId,
    verifyAndAttachBahan,
    getStockDetail
);

router.patch(
    "/:bahan_id", 
    validate(stockSchema),
    validateBahanId,
    verifyAndAttachBahan,
    createStockTransaction
);

router.delete(
    "/:bahan_id",
    validateBahanId,
    verifyAndAttachBahan,
    deleteStockBahan
);

export default router;