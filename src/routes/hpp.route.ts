import { Router } from "express";
const router = Router();
import {
    createResep,
    deleteMenuResep,
    getRecipes,
    getRecipesDetail,
    updateMenuResep
} from "../controllers/hpp.controller";
import verifyToken from "../middlewares/auth.middleware";
import { validateBahanId } from '../middlewares/hpp.middleware';
import { validateMenuId, verifyAndAttachMenu } from "../middlewares/menu.middleware";
import { validate } from "../middlewares/validate.middleware";
import { bahanSchema, updateBahanSchema } from "../validators/hpp.validator";

router.use(verifyToken);

router.get(
    "/:menu_id",
    validateMenuId,
    verifyAndAttachMenu,
    getRecipes
);

router.get(
    "/:menu_id/:bahan_id",
    validateMenuId,
    verifyAndAttachMenu,
    getRecipesDetail
);

router.post(
    "/:menu_id",
    validate(bahanSchema),
    validateMenuId,
    verifyAndAttachMenu,
    createResep
);

router.put(
    "/:menu_id/:bahan_id",
    validate(updateBahanSchema),
    validateMenuId,
    validateBahanId,
    verifyAndAttachMenu,
    updateMenuResep
);

router.delete(
    "/:menu_id/:bahan_id",
    validateMenuId,
    validateBahanId,
    verifyAndAttachMenu,
    deleteMenuResep
);

export default router;