const Mailjet = require("node-mailjet");
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});
require("dotenv").config();

const generateOtpEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP Anda - SiCuan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #0891b2;
            color: white;
            border-radius: 8px 8px 0 0;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .content {
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-top: none;
        }

        .otp-box {
            background-color: #0891b2;
            color: white;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 5px;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777777;
            border-top: 1px solid #e0e0e0;
            margin-top: 20px;
        }

        .support-button {
            display: inline-block;
            background-color: #0891b2;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="logo">SICUAN</div>
        <div>Sistem Informasi Bisnis Terpadu</div>
    </div>

    <div class="content">
        <h2 style="text-align: center; color: #0891b2;">Verifikasi Akun Anda</h2>

        <p>Halo,</p>

        <p>Kami telah mengirimkan kode OTP untuk memverifikasi identitas Anda. Gunakan kode berikut untuk melanjutkan
            proses verifikasi akun SiCuan Anda.</p>

        <div class="otp-box">
            ${otp}
        </div>

        <p style="text-align: center; font-size: 14px; color: #666666;">
            ⏱️ Berlaku selama 10 menit
        </p>
    </div>

    <div class="footer">
        <p>Salam hangat,<br><strong>Tim SiCuan</strong></p>
        <p>Email ini dikirim secara otomatis. Jangan membalas email ini.</p>
        <p>© 2025 SiCuan. Semua hak cipta dilindungi.</p>
    </div>
</body>

</html>
  `;
};

const generateWelcomeEmailTemplate = ({ email, username, nama_usaha }) => {
  const encodedMessage = encodeURIComponent(
    `Halo, saya butuh panduan lebih lengkap SiCuan untuk usaha ${nama_usaha} saya. Email: ${email}`
  );

  return `
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selamat Datang di SiCuan</title>
    <style type="text/css">
        /* Base styles */
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f5f7fa;
        }

        /* Email container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
        }

        /* Header */
        .header {
            text-align: center;
            padding: 30px 20px;
            background-color: #0891b2;
            color: white;
            border-radius: 8px 8px 0 0;
            background-image: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
        }

        .logo {
            width: 80px;
            height: auto;
            margin-bottom: 15px;
        }

        .brand-name {
            font-size: 28px;
            margin: 10px 0 5px;
            color: white;
        }

        /* Content */
        .content {
            padding: 30px;
            background-color: #ffffff;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e0e0e0;
            border-top: none;
        }

        h1 {
            color: #0891b2;
            margin-top: 0;
            font-size: 24px;
        }

        .highlight {
            color: #0891b2;
            font-weight: bold;
        }

        /* Card */
        .success-card {
            background-color: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #0891b2;
        }

        /* Button */
        .button {
            display: inline-block;
            background-color: #0891b2;
            color: white !important;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 30px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(8, 145, 178, 0.2);
            transition: all 0.3s ease;
        }

        /* Steps */
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
        }

        .step-icon {
            width: 24px;
            height: 24px;
            margin-right: 15px;
            color: #0891b2;
            flex-shrink: 0;
        }

        .step-content {
            flex-grow: 1;
        }

        /* Footer */
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666666;
            background-color: #f8fafc;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e0e0e0;
            border-top: none;
        }

        .footer-links {
            margin: 10px 0;
        }

        .footer-links a {
            color: #0891b2;
            text-decoration: none;
            margin: 0 10px;
        }

        /* Responsive */
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100%;
            }

            .content {
                padding: 20px;
            }
        }
    </style>
</head>

<body style="margin: 0; padding: 20px 0; background-color: #f5f7fa;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; padding: 0;">
        <!-- Header -->
        <div class="header"
            style="text-align: center; padding: 30px 20px; background-color: #0891b2; color: white; border-radius: 8px 8px 0 0; background-image: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);">
            <!-- Using emoji as inline icon -->
            <img class="logo" style="font-size: 48px; margin-bottom: 10px;" src="https://res.cloudinary.com/dlcdkyvrf/image/upload/v1752544865/logo_sicuan_xwjnpo.png"></img>
            <h1 class="brand-name" style="font-size: 28px; margin: 10px 0 5px;">SICUAN</h1>
            <p style="margin: 0; color: #bae6fd;">Sistem Informasi Bisnis Terpadu</p>
        </div>

        <!-- Content -->
        <div class="content"
            style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
            <h1 style="color: #0891b2; margin-top: 0; font-size: 24px;">Selamat Datang di Keluarga SiCuan!</h1>

            <p style="margin: 0 0 15px 0;">Halo <span class="highlight"
                    style="color: #0891b2; font-weight: bold;">${username}</span> dari <span class="highlight"
                    style="color: #0891b2; font-weight: bold;">${nama_usaha}</span>,</p>

            <p style="margin: 0 0 20px 0;">Terima kasih telah mempercayai <strong>SiCuan</strong> sebagai partner
                teknologi bisnis Anda. Akun Anda telah berhasil dibuat dan kami sangat antusias untuk membantu
                <strong>${nama_usaha}</strong> mencapai level kesuksesan yang baru.</p>

            <div class="success-card"
                style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0891b2;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="font-size: 24px; margin-right: 10px; color: #5CB338;">✔</div>
                    <h3 style="margin: 0; color: #0891b2;">Akun Berhasil Dibuat!</h3>
                </div>
                <p style="margin: 0;">Selamat! Akun SiCuan untuk <strong>${nama_usaha}</strong> telah aktif dan siap
                    digunakan.</p>
            </div>

            <h2 style="color: #0891b2; font-size: 20px; margin: 30px 0 15px;">Langkah Selanjutnya:</h2>

            <div class="step" style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                <div class="step-icon"
                    style="width: 24px; height: 24px; margin-right: 15px; color: #0891b2; flex-shrink: 0;">🔑</div>
                <div class="step-content" style="flex-grow: 1;">
                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">Login ke Dashboard</h3>
                    <p style="margin: 0;">Akses dashboard SiCuan dan eksplorasi fitur-fitur yang tersedia</p>
                </div>
            </div>

            <div class="step" style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                <div class="step-icon"
                    style="width: 24px; height: 24px; margin-right: 15px; color: #0891b2; flex-shrink: 0;">✏️</div>
                <div class="step-content" style="flex-grow: 1;">
                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">Kustomisasi Profil</h3>
                    <p style="margin: 0;">Lengkapi profil bisnis Anda sesuai kebutuhan</p>
                </div>
            </div>

            <div class="step" style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                <div class="step-icon"
                    style="width: 24px; height: 24px; margin-right: 15px; color: #0891b2; flex-shrink: 0;">🚀</div>
                <div class="step-content" style="flex-grow: 1;">
                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">Mulai Gunakan Fitur</h3>
                    <p style="margin: 0;">Manfaatkan semua fitur untuk mengembangkan bisnis Anda</p>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/6285947354250?text=${encodedMessage}" class="button"
                    style="display: inline-block; background-color: #0891b2; color: white !important; text-decoration: none; padding: 12px 30px; border-radius: 30px; margin: 20px 0; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(8, 145, 178, 0.2);">💬
                    Hubungi Tim Support</a>
            </div>

            <p style="margin: 0 0 15px 0;">Jika Anda memiliki pertanyaan, jangan ragu untuk membalas email ini atau
                hubungi tim support kami.</p>

            <p style="margin: 0;">Salam Sukses,<br>
                <strong style="color: #0891b2;">Tim SiCuan</strong>
            </p>
        </div>

        <!-- Footer -->
        <div class="footer"
            style="text-align: center; padding: 20px; font-size: 12px; color: #666666; background-color: #f8fafc; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
            <div class="footer-links" style="margin: 10px 0;">
                <a href="#" style="color: #0891b2; text-decoration: none; margin: 0 10px;">Kebijakan Privasi</a> |
                <a href="#" style="color: #0891b2; text-decoration: none; margin: 0 10px;">Syarat & Ketentuan</a> |
                <a href="#" style="color: #0891b2; text-decoration: none; margin: 0 10px;">Bantuan</a>
            </div>
            <p style="margin: 0;">© 2025 SiCuan. Semua Hak Cipta Dilindungi.</p>
        </div>
    </div>
</body>

</html>
  `;
};

const sendEmail = async (to, subject, otp, username, nama_usaha, type) => {
  try {
    const htmlContent =
      type === "otp"
        ? generateOtpEmailTemplate(otp, to)
        : generateWelcomeEmailTemplate({ email: to, username, nama_usaha });

    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER,
            Name: "SiCuan Service",
          },
          To: [{ Email: to }],
          Subject: subject,
          TextPart:
            type === "otp"
              ? `Kode OTP Anda adalah ${otp}`
              : "Selamat datang di SiCuan!",
          HTMLPart: htmlContent,
        },
      ],
    });

    return { success: true, message: "Email berhasil dikirim" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Cloud Function entry point
exports.processEmailQueue = async (message, context) => {
  try {
    const messageBody = message.data
      ? Buffer.from(message.data, "base64").toString()
      : null;

    if (!messageBody) {
      console.error("No message body found");
      return;
    }

    const emailData = JSON.parse(messageBody);

    const { to, subject, otp, type, username, nama_usaha } = emailData;

    if (!to || !subject || !type) {
      console.error("Missing required fields in email data");
      return;
    }

    const result = await sendEmail(
      to,
      subject,
      otp,
      username,
      nama_usaha,
      type
    );

    if (result.success) {
      console.log(`Email sent successfully to ${to}`);
    } else {
      console.error(`Failed to send email to ${to}:`, result.message);
    }
  } catch (error) {
    console.error("Error processing email message:", error);
  }
};
