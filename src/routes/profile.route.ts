import { Router } from "express";
const router = Router();
import {
    updatePassword,
    userProfile
} from "../controllers/profile.controller";
import verifyToken from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { passwordConfirmationSchema } from "../validators/auth.validator";

router.use(verifyToken);

router.get(
    "/", 
    userProfile
);

router.patch(
    "/password",
    validate(passwordConfirmationSchema),
    updatePassword
);

export default router;