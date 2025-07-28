import { createContainer, asFunction } from "awilix";
import {
  userProfileController,
  updatePasswordController,
} from "../controllers/profile";
import {
  userProfileService,
  updatePasswordService,
} from "../services/ProfileService";

const container = createContainer();

container.register({
  // Services
  userProfileService: asFunction(() => userProfileService).scoped(),
  updatePasswordService: asFunction(() => updatePasswordService).scoped(),

  // Controllers
  userProfile: asFunction(userProfileController).scoped(),
  updatePassword: asFunction(updatePasswordController).scoped(),
});

export default container;
