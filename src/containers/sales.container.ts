import { createContainer, asFunction } from "awilix";
import {
  getSalesSummaryController,
  getSalesCustomController,
  createSalesController,
  deleteSalesController,
} from "../controllers/sale";
import {
  getSalesSummaryService,
  createSalesService,
  getSalesCustomService,
  deleteSalesService,
} from "../services/SalesService";

const container = createContainer();

container.register({
  // Services
  getSalesSummaryService: asFunction(() => getSalesSummaryService).singleton(),
  getSalesCustomService: asFunction(() => getSalesCustomService).singleton(),
  createSalesService: asFunction(() => createSalesService).scoped(),
  deleteSalesService: asFunction(() => deleteSalesService).scoped(),

  // Controllers
  getSalesSummary: asFunction(getSalesSummaryController).scoped(),
  getSalesCustom: asFunction(getSalesCustomController).scoped(),
  createSales: asFunction(createSalesController).scoped(),
  deleteSales: asFunction(deleteSalesController).scoped(),
});

export default container;
