import { createContainer, asFunction } from "awilix";
import {
    getSalesSummaryController,
    getSalesController,
    createSalesController,
    // deleteStockController,
} from "../controllers/sale";
import {
    getSalesSummaryService,
    createSalesService,
    getSalesService,
    // deleteStockService,
} from "../services/SalesService";

const container = createContainer();

container.register({
    // Services
    getSalesSummaryService: asFunction(() => getSalesSummaryService).singleton(),
    getSalesService: asFunction(() => getSalesService).singleton(),
    createSalesService: asFunction(() => createSalesService).scoped(),
    // deleteStockService: asFunction(() => deleteStockService).scoped(),

    // Controllers
    getSalesSummary: asFunction(getSalesSummaryController).scoped(),
    getSales: asFunction(getSalesController).scoped(),
    createSales: asFunction(createSalesController).scoped(),
    // deleteStock: asFunction(deleteStockController).scoped(),
});

export default container;
