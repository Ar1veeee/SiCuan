import { createContainer, asFunction } from "awilix";
import {
    getSalesSummaryController,
    getSalesController,
    createSalesController,
    deleteSalesController,
} from "../controllers/sale";
import {
    getSalesSummaryService,
    createSalesService,
    getSalesService,
    deleteSalesService
} from "../services/SalesService";

const container = createContainer();

container.register({
    // Services
    getSalesSummaryService: asFunction(() => getSalesSummaryService).singleton(),
    getSalesService: asFunction(() => getSalesService).singleton(),
    createSalesService: asFunction(() => createSalesService).scoped(),
    deleteSalesService: asFunction(() => deleteSalesService).scoped(),


    // Controllers
    getSalesSummary: asFunction(getSalesSummaryController).scoped(),
    getSales: asFunction(getSalesController).scoped(),
    createSales: asFunction(createSalesController).scoped(),
    deleteSales: asFunction(deleteSalesController).scoped(),
});

export default container;
