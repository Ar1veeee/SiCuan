// Import configurations
import { Router } from "express";
const router = Router();

// Import containers
import containerSales from "../containers/sales.container";
import containerStock from "../containers/stock.container";

// Import validation
import verifyToken from "../middlewares/auth.middleware";

const getStockSummary = containerStock.resolve("getStockSummary");
const getSalesSummary = containerSales.resolve("getSalesSummary");

// Route endpoint
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