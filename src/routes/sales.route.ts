import { Router } from "express";
const router = Router();
import { 
    createSales,
    getSales
} from "../controllers/sales.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateSalesId, verifyAndAttachSalesItem } from "../middlewares/sales.middleware";
import { getSalesQuerySchema, salesSchema } from "../validators/sales.validator";
import verifyToken from "../middlewares/auth.middleware";


router.use(verifyToken);

router.get(
    "/",
    validate(getSalesQuerySchema),
    getSales
);

router.post(
    "/", 
    validate(salesSchema),
    createSales
);

// router.delete(
//     "/:bahan_id",
//     validateBahanId,
//     verifyAndAttachBahan,
//     deleteStock
// );

export default router;