import { Router } from "express";
const router = Router()
import { updatePassword, userProfile } from "../controllers/ProfileController";
import verifyToken from "../middlewares/AuthMiddleware";

router.use(verifyToken)

router.get("/:user_id/", userProfile)
router.patch("/:user_id/", updatePassword)

export default router;