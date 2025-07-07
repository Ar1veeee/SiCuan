import { Router } from "express";
const router = Router();
import {
    createMenu,
    getMenus,
    getMenuDetail,
    updateMenu,
    deleteMenu,
    menuSellingPrice,
} from "../controllers/menu.controller";
import verifyToken from "../middlewares/auth.middleware";
import {
    validateMenuId,
    verifyAndAttachMenu
} from "../middlewares/menu.middleware";
import { validate } from "../middlewares/validate.middleware";
import { menuBodySchema } from "../validators/menu.validator";
import { sellSchema } from "../validators/sell.validator";

router.use(verifyToken);

router.get(
    "/",
    getMenus,
);

router.patch(
    "/selling-price",
    validate(sellSchema),
    menuSellingPrice 
);


router.get(
    "/:menu_id",
    validateMenuId,
    verifyAndAttachMenu,
    getMenuDetail
);

router.post(
    "/",
    validate(menuBodySchema),
    createMenu
);

router.patch(
    "/:menu_id",
    validate(menuBodySchema),
    validateMenuId,
    verifyAndAttachMenu,
    updateMenu
);

router.delete(
    "/:menu_id",
    validateMenuId,
    verifyAndAttachMenu,
    deleteMenu
);

export default router;