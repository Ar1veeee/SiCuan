import { Router } from "express";
const router = Router()
import { updatePassword, userProfile } from "../controllers/ProfileController";
import verifyToken from "../middlewares/AuthMiddleware";
import verifyUserAccess from "../middlewares/VerifyUserAccess";

router.use(verifyToken)

router.get("/:user_id/", verifyUserAccess, userProfile)
router.patch("/:user_id/", verifyUserAccess, updatePassword)

export default router;