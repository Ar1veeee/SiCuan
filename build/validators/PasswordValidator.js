"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassowrd = void 0;
const UserValidator_1 = require("./UserValidator");
const validatePassowrd = (password, confirmPassword) => {
    if (!UserValidator_1.passwordValidation.isValidPassword(password)) {
        throw new Error(UserValidator_1.passwordValidation.getValidationMessage(password, confirmPassword));
    }
    if (!UserValidator_1.passwordValidation.isPasswordMatch(password, confirmPassword)) {
        throw new Error('Konfirmasi password tidak cocok');
    }
    return null;
};
exports.validatePassowrd = validatePassowrd;
