import { Router } from "express";
const router = Router();
import {
    updatePassword,
    userProfile
} from "../controllers/profile.controller";
import verifyToken from "../middlewares/auth.middleware";
import {
    validatePasswordMatch
} from "../middlewares/profile.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updatePasswordSchema } from "../validators/UserValidator";

router.use(verifyToken);

router.get(
    "/", 
    userProfile
);

router.patch(
    "/password",
    validate(updatePasswordSchema),
    validatePasswordMatch,
    updatePassword
);

export default router;