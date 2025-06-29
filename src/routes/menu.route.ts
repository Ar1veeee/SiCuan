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

router.use(verifyToken);

router.get(
    "/",
    getMenus,
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

router.patch(
    "/:menu_id/selling-price",
    validateMenuId, 
    verifyAndAttachMenu,
    menuSellingPrice 
);

export default router;