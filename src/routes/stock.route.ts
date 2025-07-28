// Import configuration
import { Router } from "express";
const router = Router();

// Import container
import container from "../containers/stock.container";

// Import middlewares
import { validate } from "../middlewares/validate.middleware";
import {
  validateBahanId,
  verifyAndAttachBahan,
} from "../middlewares/stock.middleware";
import verifyToken from "../middlewares/auth.middleware";

// Import validation
import { stockSchema } from "../validators/stock.validator";

const getStocks = container.resolve("getStocks");
const getStockDetail = container.resolve("getStockDetail");
const createStockTransaction = container.resolve("createStockTransaction");
const deleteStock = container.resolve("deleteStock");

// Route endpoint
router.use(verifyToken);
router.get("/", getStocks);

router.get("/:bahan_id", validateBahanId, verifyAndAttachBahan, getStockDetail);

router.patch(
  "/:bahan_id",
  validate(stockSchema),
  validateBahanId,
  verifyAndAttachBahan,
  createStockTransaction
);

router.delete("/:bahan_id", validateBahanId, verifyAndAttachBahan, deleteStock);

export default router;
