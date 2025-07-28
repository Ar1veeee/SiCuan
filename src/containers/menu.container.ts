import { createContainer, asFunction } from "awilix";
import {
  createMenuController,
  getMenusController,
  getMenuDetailController,
  updateSellingPriceController,
  updateMenuController,
  deleteMenuController,
} from "../controllers/menu";
import {
  createMenuService,
  getMenusService,
  updateMenuService,
  menuSellingPriceService,
  deleteMenuService,
} from "../services/MenuService";

const container = createContainer();

container.register({
  // Services
  createMenuService: asFunction(() => createMenuService).singleton(),
  getMenusService: asFunction(() => getMenusService).singleton(),
  updateMenuService: asFunction(() => updateMenuService).singleton(),
  menuSellingPriceService: asFunction(() => menuSellingPriceService).scoped(),
  deleteMenuService: asFunction(() => deleteMenuService).singleton(),

  // Controllers
  createMenu: asFunction(createMenuController).scoped(),
  getMenus: asFunction(getMenusController).scoped(),
  getMenuDetail: asFunction(getMenuDetailController).scoped(),
  updateMenu: asFunction(updateMenuController).scoped(),
  updateSellingPrice: asFunction(updateSellingPriceController).scoped(),
  deleteMenu: asFunction(deleteMenuController).scoped(),
});

export default container;
