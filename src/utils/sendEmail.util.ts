import nodemailer from "nodemailer";
import { generateOtpEmailTemplate } from "./emailTemplate.util";
import dotenv from "dotenv";
import { ApiError } from "../exceptions/apiError";
dotenv.config();

export const sendEmail = async (to: string, subject: string, otp: string):Promise<object> => {
    try {
        if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
            throw new ApiError("Mailjet credentials missing from environment variables", 400);
        }
        const transporter = nodemailer.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAILJET_API_KEY,
                pass: process.env.MAILJET_SECRET_KEY,
            }
        });
        await transporter.verify();
        console.log("Koneksi SMTP Mailjet berhasil");
        const htmlContent = generateOtpEmailTemplate(otp, to);
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
        }

        const info = await transporter.sendMail(mailOption);
        console.log('Email berhasil dikirim:', info.response);
        return { success: true, message: "Email berhasil dikirim" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};