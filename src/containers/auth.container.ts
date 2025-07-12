import { createContainer, asFunction } from "awilix";
import {
    registerController,
    loginController,
    refreshTokenController,
    sendOtpController,
    verifyOtpController,
    resetPasswordController,
} from "../controllers/auth";
import {
    registerService,
    loginService,
    refreshTokenService,
    sendOtpService,
    verifyOtpService,
    resetPasswordService,
} from "../services/AuthService";

const container = createContainer();

container.register({
    // Services
    registerService: asFunction(() => registerService).singleton(),
    loginService: asFunction(() => loginService).singleton(),
    refreshTokenService: asFunction(() => refreshTokenService).singleton(),
    sendOtpService: asFunction(() => sendOtpService).scoped(),
    verifyOtpService: asFunction(() => verifyOtpService).scoped(),
    resetPasswordService: asFunction(() => resetPasswordService).singleton(),

    // Controllers
    register: asFunction(registerController).scoped(),
    login: asFunction(loginController).scoped(),
    refreshToken: asFunction(refreshTokenController).scoped(),
    sendOtp: asFunction(sendOtpController).scoped(),
    verifyOtp: asFunction(verifyOtpController).scoped(),
    resetPassword: asFunction(resetPasswordController).scoped(),
});

export default container;
