import { Router } from "express";
const router = Router();
import { 
    createResep, 
    deleteMenuResep, 
    getRecipes, 
    updateMenuResep 
} from "../controllers/hpp.controller";
import verifyToken from "../middlewares/auth.middleware";
import { 
    validateMenuId, 
    validateBahanId, 
    verifyHppOwnership 
} from '../middlewares/hpp.middleware';
import { validate } from "../middlewares/validate.middleware";
import { bahanSchema } from "../validators/HppValidator";

router.use(verifyToken);

router.get(
    "/:menu_id", 
    validateMenuId,
    verifyHppOwnership,
    getRecipes
);

router.post(
    "/:menu_id", 
    validate(bahanSchema),
    validateMenuId,
    verifyHppOwnership,
    createResep
);

router.put(
    "/:menu_id/:bahan_id", 
    validate(bahanSchema),
    validateMenuId,
    validateBahanId,
    verifyHppOwnership,
    updateMenuResep
);

router.delete(
    "/:menu_id/:bahan_id", 
    validateMenuId,
    validateBahanId,
    verifyHppOwnership,
    deleteMenuResep
);

export default router;