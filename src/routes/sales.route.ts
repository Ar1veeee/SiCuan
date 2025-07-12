// Import configurations
import { Router } from "express";
import container from "../containers/sales.container";
const router = Router();

// Import middlewares
import { validate } from "../middlewares/validate.middleware";
import verifyToken from "../middlewares/auth.middleware";
// import { validateSalesId, verifyAndAttachSalesItem } from "../middlewares/sales.middleware";

// Import validation
import { getSalesQuerySchema, salesSchema } from "../validators/sales.validator";

const getSales = container.resolve("getSales");
const createSales = container.resolve("createSales");

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