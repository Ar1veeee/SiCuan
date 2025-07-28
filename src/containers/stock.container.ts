import { createContainer, asFunction } from "awilix";
import {
  getStockSummaryController,
  getStocksController,
  getStockDetailController,
  createStockTransactionController,
  deleteStockController,
} from "../controllers/stock";
import {
  getStockSummaryService,
  getStocksService,
  createStockTransactionService,
  deleteStockService,
} from "../services/StockService";

const container = createContainer();

container.register({
  // Services
  getStockSummaryService: asFunction(() => getStockSummaryService).singleton(),
  getStocksService: asFunction(() => getStocksService).singleton(),
  createStockTransactionService: asFunction(
    () => createStockTransactionService
  ).scoped(),
  deleteStockService: asFunction(() => deleteStockService).scoped(),

  // Controllers
  getStockSummary: asFunction(getStockSummaryController).scoped(),
  getStocks: asFunction(getStocksController).scoped(),
  getStockDetail: asFunction(getStockDetailController).scoped(),
  createStockTransaction: asFunction(createStockTransactionController).scoped(),
  deleteStock: asFunction(deleteStockController).scoped(),
});

export default container;
