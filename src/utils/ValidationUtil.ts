export const passwordValidation = {
    isValidPassword: (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?/-]).{8,}$/;
        return passwordRegex.test(password.trim());
    },
    isPasswordMatch: (password: string, confirmPassword: string): boolean => {
        return password.trim() === confirmPassword.trim()
    },
    getValidationMessage: (password: string, confirmPassword: string): string => {
        if (!password.trim()) return "Password is required"
        if (!confirmPassword.trim()) return "Confirm Password is required"
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (!/^[A-Z]/.test(password)) return "Password must begin with an uppercase letter.";
        if (!/\d/.test(password)) return "Password must contain at least one number.";
        if (!/[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?/-]/.test(password)) return "Password must contain at least one special character.";
        if (!passwordValidation.isPasswordMatch(password, confirmPassword)) return "Password and Confirm Password must be the same."
        return "Password is valid.";
    }
}

export const emailValidation = {
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email)
    },
    getValidationMessage: (email: string): string => {
        if (!email) return "Email is required"
        if (!emailValidation.isValidEmail(email)) return "Invalid email format."
        return "Email is valid"
    }
}