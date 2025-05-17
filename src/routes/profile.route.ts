import { Router } from "express";
const router = Router()
import { updatePassword, userProfile } from "../controllers/profile.controller";
import verifyToken from "../middlewares/auth.middleware";
import verifyUserAccess from "../middlewares/userAccess.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updatePasswordSchema } from "../validators/UserValidator";

router.use(verifyToken)

// Menampilkan profile berdasarkan user_id 
router.get("/:user_id/", verifyUserAccess, userProfile)

// Memperbarui password berdasarkan user_id
router.patch("/:user_id/", validate(updatePasswordSchema), verifyUserAccess, updatePassword)

export default router;