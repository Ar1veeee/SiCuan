import { Router } from "express";
const router = Router();
import { getStockSummary } from "../controllers/stock.controller";
import { getSalesSummary } from "../controllers/sales.controller";
import verifyToken from "../middlewares/auth.middleware";


router.use(verifyToken);

router.get(
    "/stock-summary",
    getStockSummary
);

router.get(
    "/sales-summary",
    getSalesSummary
);

export default router;