import { Router } from "express";
const router = Router()
import { createResep, Recipes } from "../controllers/HppController";
import verifyToken from "../middlewares/AuthMiddleware";
import verifyUserAccess from "../middlewares/VerifyUserAccess";
import { validate } from "../middlewares/Validate";
import { bahanSchema } from "../validators/HppValidator";

router.use(verifyToken)

router.get("/:user_id/:menu_id", verifyUserAccess, Recipes)
router.post("/:user_id/:menu_id", validate(bahanSchema), verifyUserAccess, createResep)

export default router;