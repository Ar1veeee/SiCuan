"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplate_util_1 = require("./emailTemplate.util");
const dotenv_1 = __importDefault(require("dotenv"));
const apiError_1 = require("../exceptions/apiError");
dotenv_1.default.config();
const sendEmail = (to, subject, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
            throw new apiError_1.ApiError("Mailjet credentials missing from environment variables", 400);
        }
        const transporter = nodemailer_1.default.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAILJET_API_KEY,
                pass: process.env.MAILJET_SECRET_KEY,
            }
        });
        yield transporter.verify();
        console.log("Koneksi SMTP Mailjet berhasil");
        const htmlContent = (0, emailTemplate_util_1.generateOtpEmailTemplate)(otp, to);
        const fromEmail = process.env.MAILJET_SENDER || process.env.MAILJET_API_KEY.split('@')[0] + '@example.com';
        const mailOption = {
            from: `"SiCuan Service" <${fromEmail}>`,
            to,
            subject,
            html: htmlContent,
            text: `Kode OTP Anda adalah: ${otp}. Kode ini berlaku untuk 10 menit.`,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            }
        };
        const info = yield transporter.sendMail(mailOption);
        console.log('Email berhasil dikirim:', info.response);
        return { success: true, message: "Email berhasil dikirim" };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
});
exports.sendEmail = sendEmail;
