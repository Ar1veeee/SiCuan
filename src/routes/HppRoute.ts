import { Router } from "express";
const router = Router()
import { createResep } from "../controllers/HppController";
import verifyToken from "../middlewares/AuthMiddleware";
import verifyUserAccess from "../middlewares/VerifyUserAccess";

router.use(verifyToken)

router.post("/:user_id/:menu_id", verifyUserAccess, createResep)

export default router;