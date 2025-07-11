const nodemailer = require('nodemailer');
require("dotenv").config();

const generateOtpEmailTemplate = (otp, email) => {
  const encodedMessage = encodeURIComponent(`Halo, saya butuh bantuan terkait OTP. Email saya: ${email}`);
  return `
    <!DOCTYPE html>
    <html lang="id" dir="ltr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Kode OTP Anda</title>
        <style>
          @media only screen and (max-width: 600px) {
            table.email-container {
              width: 100% !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <div style="display: none; max-height: 0px; overflow: hidden;">
          Kode OTP Anda untuk verifikasi. Berlaku selama 10 menit.
        </div>

        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
          <tr>
            <td>
              <table class="email-container" align="center" width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
                <tr>
                  <td style="text-align: center;">
                    <h2 style="color: #2b3e50;">Kode OTP Anda</h2>
                    <p style="color: #555; font-size: 16px;">
                      Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Silakan gunakan kode OTP berikut untuk melanjutkan:
                    </p>
                    <div style="margin: 20px 0;">
                      <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #ffffff; background-color: #4a90e2; padding: 12px 24px; border-radius: 6px;" aria-label="Kode OTP Anda">
                        ${otp}
                      </span>
                    </div>
                    <p style="color: #999; font-size: 14px;">
                      Kode ini berlaku selama 10 menit. Jika Anda tidak meminta reset password, Anda dapat mengabaikan email ini.
                    </p>

                    <p style="color: #999; font-size: 14px;">
                      Jika Anda mengalami masalah, 
                      <a href="https://wa.me/6285947354250?text=${encodedMessage}" style="color: #4a90e2; text-decoration: none;">
                        klik di sini untuk bantuan
                      </a>.
                    </p>

                    <p style="color: #999; font-size: 14px; margin-top: 30px;">
                      Salam hangat,<br/>
                      <strong>Tim Dukungan Si Cuan</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

const sendEmail = async (to, subject, otp) => {
  try {
    const htmlContent = generateOtpEmailTemplate(otp, to);

    const response = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_SENDER,
              Name: "SiCuan Service",
            },
            To: [{ Email: to }],
            Subject: subject,
            TextPart: `Kode OTP Anda adalah ${otp}`,
            HTMLPart: htmlContent,
          },
        ],
      });

    console.log("Email berhasil dikirim:", response.body);
    return { success: true, message: "Email berhasil dikirim" };
  } catch (error) {
    console.error("Gagal kirim email via Mailjet API:", error);
    return { success: false, message: error.message };
  }
};



// Cloud Function entry point
exports.processEmailQueue = async (message, context) => {
    try {
        const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
        
        if (!messageBody) {
            console.error('No message body found');
            return;
        }

        const emailData = JSON.parse(messageBody);
        console.log('Processing email:', emailData);

        // Validate required fields
        if (!emailData.to || !emailData.subject || !emailData.otp) {
            console.error('Missing required fields in email data');
            return;
        }

        // Send email
        const result = await sendEmail(emailData.to, emailData.subject, emailData.otp);
        
        if (result.success) {
            console.log(`Email sent successfully to ${emailData.to}`);
        } else {
            console.error(`Failed to send email to ${emailData.to}:`, result.message);
        }
    } catch (error) {
        console.error('Error processing email message:', error);
    }
};