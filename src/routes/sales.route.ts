// Import configurations
import { Router } from "express";
import container from "../containers/sales.container";
const router = Router();

// Import middlewares
import { validate } from "../middlewares/validate.middleware";
import verifyToken from "../middlewares/auth.middleware";
import {
  validateSalesId,
  verifyAndAttachSalesItem,
} from "../middlewares/sales.middleware";

// Import validation
import {
  getSalesQuerySchema,
  salesSchema,
} from "../validators/sales.validator";

const getSalesCustom = container.resolve("getSalesCustom");
const createSales = container.resolve("createSales");
const deleteSales = container.resolve("deleteSales");

router.use(verifyToken);
router.get("/custom", validate(getSalesQuerySchema), getSalesCustom);
router.get("/", getSalesCustom);

router.post("/", validate(salesSchema), createSales);

router.delete(
  "/:sales_id",
  validateSalesId,
  verifyAndAttachSalesItem,
  deleteSales
);

export default router;
