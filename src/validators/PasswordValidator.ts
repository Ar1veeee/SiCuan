import { passwordValidation } from "./UserValidator";

export const validatePassowrd = (password: string, confirmPassword: string) => {
    if (!passwordValidation.isValidPassword(password)) {
        throw new Error(passwordValidation.getValidationMessage(password, confirmPassword));
    }

    if (!passwordValidation.isPasswordMatch(password, confirmPassword)) {
        throw new Error('Konfirmasi password tidak cocok');
    }
    return null
}