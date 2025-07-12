// Import configurations
import { Router } from "express";
import container from "../containers/menu.container";
const router = Router();

// Import middlewares
import verifyToken from "../middlewares/auth.middleware";
import {
    validateMenuId,
    verifyAndAttachMenu
} from "../middlewares/menu.middleware";
import { validate } from "../middlewares/validate.middleware";

// Import validations
import { menuBodySchema } from "../validators/menu.validator";
import { sellSchema } from "../validators/sell.validator";

const getMenus = container.resolve("getMenus");
const updateSellingPrice = container.resolve("updateSellingPrice");
const getMenuDetail = container.resolve("getMenuDetail")
const createMenu = container.resolve("createMenu");
const updateMenu = container.resolve("updateMenu");
const deleteMenu = container.resolve("deleteMenu");

router.use(verifyToken);
router.get(
    "/",
    getMenus,
);

router.patch(
    "/selling-price",
    validate(sellSchema),
    updateSellingPrice 
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