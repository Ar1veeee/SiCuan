import { Router } from "express";
const router = Router();
import {
    createMenu,
    getMenus,
    getMenuDetail,
    updateMenu,
    deleteMenu,
} from "../controllers/menu.controller";
import verifyToken from "../middlewares/auth.middleware";
import {
    validateMenuId,
    verifyMenuOwnership
} from "../middlewares/menu.middleware";
import { validate } from "../middlewares/validate.middleware";
import { menuSchema } from "../validators/MenuValidator";

router.use(verifyToken);

router.get(
    "/",
    getMenus
);

router.get(
    "/:menu_id",
    validateMenuId,
    getMenuDetail
);

router.post(
    "/",
    validate(menuSchema),
    createMenu
);

router.patch(
    "/:menu_id",
    validate(menuSchema),
    validateMenuId,
    verifyMenuOwnership,
    updateMenu
);

router.delete(
    "/:menu_id",
    validateMenuId,
    verifyMenuOwnership,
    deleteMenu
);

export default router;