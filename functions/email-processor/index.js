const Mailjet = require("node-mailjet");
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});
require("dotenv").config();

const generateOtpEmailTemplate = (otp, email) => {
  const encodedMessage = encodeURIComponent(
    `Halo, saya butuh bantuan terkait OTP. Email: ${email}`
  );
  return `
    <!DOCTYPE html>
<html lang="id" dir="ltr">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kode OTP Anda - SiCuan</title>
    <style>
        /* Import Google Font */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        /* Reset & Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            min-height: 100vh;
            background: #f3f4f6;
            padding: 20px;
        }

        /* Theme Selector */
        .theme-selector {
            max-width: 600px;
            margin: 0 auto 30px;
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .theme-selector h2 {
            margin-bottom: 15px;
            color: #1f2937;
            font-size: 18px;
        }

        .theme-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .theme-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            color: white;
        }

        .theme-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .theme-btn.active {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }

        /* Container Styles */
        .email-container {
            max-width: 550px;
            margin: 0 auto;
            background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.8);
        }

        /* Header with Gradient */
        .email-header {
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .email-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="20" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
            opacity: 0.3;
        }

        .header-content {
            position: relative;
            z-index: 1;
        }

        .logo-container {
            margin-bottom: 20px;
        }

        .logo-icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .brand-name {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 2px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
            margin-top: 8px;
        }

        /* Main Content */
        .email-body {
            padding: 50px 40px;
            text-align: center;
        }

        .security-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .main-title {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 15px;
            background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .description {
            color: #6b7280;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 35px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }

        /* OTP Code Container */
        .otp-container {
            border-radius: 20px;
            padding: 30px;
            margin: 35px 0;
            position: relative;
            overflow: hidden;
        }

        .otp-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% {
                left: -100%;
            }

            100% {
                left: 100%;
            }
        }

        .otp-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .otp-code {
            font-size: 48px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 8px;
            font-family: 'Inter', monospace;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .otp-timer {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 8px 16px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            font-weight: 500;
            display: inline-block;
            backdrop-filter: blur(10px);
        }

        /* Info Cards */
        .info-cards {
            display: flex;
            gap: 20px;
            margin: 40px 0;
            flex-wrap: wrap;
            justify-content: center;
        }

        .info-card {
            background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
            border: 1px solid rgba(148, 163, 184, 0.3);
            border-radius: 16px;
            padding: 20px;
            flex: 1;
            min-width: 200px;
            max-width: 250px;
            text-align: center;
            transition: all 0.3s ease;
        }

        .info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .info-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .info-title {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
        }

        .info-desc {
            font-size: 12px;
            color: #6b7280;
            line-height: 1.4;
        }

        /* Support Section */
        .support-section {
            border-radius: 16px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            border: 1px solid;
        }

        .support-icon {
            font-size: 32px;
            margin-bottom: 15px;
        }

        .support-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .support-desc {
            font-size: 14px;
            margin-bottom: 20px;
        }

        .support-button {
            display: inline-block;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .support-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        /* Footer */
        .email-footer {
            background: #f8fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }

        .footer-content {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
        }

        .footer-links {
            margin-top: 20px;
        }

        .footer-links a {
            text-decoration: none;
            margin: 0 10px;
            font-size: 12px;
        }

        .footer-links a:hover {
            text-decoration: underline;
        }

        /* Theme Variations */
        .theme-ocean {
            background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
        }

        .theme-ocean .email-header {
            background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
        }

        .theme-ocean .otp-container {
            background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
        }

        .theme-ocean .security-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .theme-ocean .support-section {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-color: #0891b2;
        }

        .theme-ocean .support-title {
            color: #0c4a6e;
        }

        .theme-ocean .support-desc {
            color: #075985;
        }

        .theme-ocean .support-button {
            background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
            box-shadow: 0 4px 15px rgba(8, 145, 178, 0.3);
        }

        .theme-ocean .footer-brand {
            color: #0891b2;
        }

        .theme-ocean .footer-links a {
            color: #0891b2;
        }


        /* Responsive Design */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 95% !important;
                margin: 20px auto;
                border-radius: 16px;
            }

            .email-header {
                padding: 30px 20px;
            }

            .email-body {
                padding: 30px 20px;
            }

            .brand-name {
                font-size: 24px;
            }

            .main-title {
                font-size: 24px;
            }

            .otp-code {
                font-size: 36px;
                letter-spacing: 4px;
            }

            .info-cards {
                flex-direction: column;
                gap: 15px;
            }

            .info-card {
                max-width: 100%;
            }

            .email-footer {
                padding: 20px;
            }

            .theme-buttons {
                justify-content: center;
            }

            .theme-btn {
                font-size: 12px;
                padding: 6px 12px;
            }
        }
    </style>
</head>

<body>
    <div align="center" width="100%" cellpadding="0" cellspacing="0" class="theme-ocean" id="emailBody"
        style="padding: 40px 20px; min-height: 100vh;">
        <tr>
            <td>
                <table class="email-container" align="center" cellpadding="0" cellspacing="0">
                    <!-- Header -->
                    <tr>
                        <td class="email-header">
                            <div class="header-content">
                                <div class="logo-container">
                                    <div class="logo-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55"
                                            viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-earth-lock-icon lucide-earth-lock">
                                            <path d="M7 3.34V5a3 3 0 0 0 3 3" />
                                            <path d="M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
                                            <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
                                            <path d="M12 2a10 10 0 1 0 9.54 13" />
                                            <path d="M20 6V4a2 2 0 1 0-4 0v2" />
                                            <rect width="8" height="5" x="14" y="6" rx="1" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="brand-name">SICUAN</div>
                                <div class="header-subtitle">Sistem Informasi Bisnis Terpadu</div>
                            </div>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td class="email-body">
                            <div class="security-badge">
                                🔒 Keamanan Terjamin
                            </div>

                            <h1 class="main-title">Verifikasi Akun Anda</h1>

                            <p class="description">
                                Kami telah mengirimkan kode OTP untuk memverifikasi identitas Anda.
                                Gunakan kode berikut untuk melanjutkan proses verifikasi akun SiCuan Anda.
                            </p>

                            <!-- OTP Container -->
                            <div class="otp-container">
                                <div class="otp-label">Kode Verifikasi Anda</div>
                                <div class="otp-code" aria-label="Kode OTP Anda">
                                    ${otp}
                                </div>
                                <div class="otp-timer">
                                    ⏱️ Berlaku selama 10 menit
                                </div>
                            </div>

                            <!-- Info Cards -->
                            <div class="info-cards">
                                <div class="info-card">
                                    <div class="info-icon">🔐</div>
                                    <div class="info-title">Keamanan Tinggi</div>
                                    <div class="info-desc">Kode OTP dienkripsi untuk melindungi akun Anda</div>
                                </div>
                                <div class="info-card">
                                    <div class="info-icon">⚡</div>
                                    <div class="info-title">Proses Cepat</div>
                                    <div class="info-desc">Verifikasi instan setelah memasukkan kode</div>
                                </div>
                            </div>

                            <!-- Support Section -->
                            <div class="support-section">
                                <div class="support-icon">💬</div>
                                <div class="support-title">Butuh Bantuan?</div>
                                <div class="support-desc">
                                    Jika Anda mengalami kesulitan atau tidak meminta kode ini,
                                    tim support kami siap membantu Anda.
                                </div>
                                <a href="https://wa.me/6285947354250" class="support-button">
                                    Hubungi Support
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="email-footer">
                            <div class="footer-content">
                                <p>
                                    Salam hangat,<br>
                                    <span class="footer-brand">Tim SiCuan</span>
                                </p>
                                <p style="margin-top: 15px; font-size: 12px;">
                                    Email ini dikirim secara otomatis. Jangan membalas email ini.
                                </p>
                                <div class="footer-links">
                                    <a href="#">Kebijakan Privasi</a>
                                    <a href="#">Syarat & Ketentuan</a>
                                    <a href="#">Bantuan</a>
                                </div>
                                <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
                                    © 2025 SiCuan. Semua hak cipta dilindungi.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </div>

    <script>
        function changeTheme(theme) {
            const emailBody = document.getElementById('emailBody');
            const buttons = document.querySelectorAll('.theme-btn');

            // Remove all theme classes
            emailBody.className = emailBody.className.replace(/theme-\w+/g, '');

            // Add new theme class
            emailBody.classList.add('theme-' + theme);

            // Update active button
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }
    </script>
</body>

</html>
  `;
};

const generateWelcomeEmailTemplate = (email, username, nama_usaha) => {
  const encodedMessage = encodeURIComponent(
    `Halo, saya butuh panduan lebih lengkap SiCuan untuk usaha ${nama_usaha} saya. Email: ${email}`
  );
  return `
  <!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selamat Datang di SiCuan!</title>
    <style>
        /* Import Google Font */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        /* Reset & Body Styles */
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            font-family: 'Inter', Arial, sans-serif;
            color: #e0e0e0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Container Styles */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
        }

        .email-card {
            background: linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 50px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }

        .email-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #00aaff, #0088cc, #00aaff);
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .header {
            padding: 40px 0 30px;
            text-align: center;
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 3px;
            text-shadow: 0 0 20px rgba(0, 170, 255, 0.3);
        }

        /* Logo Container with Glow Effect */
        .logo-container {
            margin-bottom: 30px;
            position: relative;
            display: inline-block;
        }

        .logo-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
            background: radial-gradient(circle, rgba(0, 170, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }

        .logo-svg {
            position: relative;
            z-index: 1;
        }

        /* Typography */
        h1 {
            color: #ffffff;
            font-size: 36px;
            font-weight: 700;
            margin-top: 30px;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: none;
        }

        p {
            color: #b8b8b8;
            font-size: 16px;
            line-height: 1.8;
            margin: 0 0 25px;
            font-weight: 400;
        }

        .highlight-text {
            color: #00aaff;
            font-weight: 600;
        }

        /* Button Styles with Modern Design */
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
            color: #ffffff;
            padding: 16px 40px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            margin: 25px 0 40px;
            transition: all 0.3s ease;
            box-shadow: 0 8px 30px rgba(0, 170, 255, 0.3);
            position: relative;
            overflow: hidden;
        }

        .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .cta-button:hover::before {
            left: 100%;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 170, 255, 0.4);
        }

        /* Success Card */
        .success-card {
            background: linear-gradient(135deg, rgba(0, 200, 100, 0.1) 0%, rgba(0, 170, 255, 0.1) 100%);
            border: 1px solid rgba(0, 200, 100, 0.3);
            border-radius: 20px;
            padding: 25px;
            margin: 30px 0;
            display: flex;
            align-items: center;
            gap: 20px;
            text-align: left;
            backdrop-filter: blur(10px);
            animation: slideInUp 0.6s ease-out;
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .success-icon {
            font-size: 32px;
            min-width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #00c864 0%, #00aa55 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 25px rgba(0, 200, 100, 0.3);
        }

        .success-content h3 {
            color: #00c864;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 8px 0;
        }

        .success-content p {
            color: #b8b8b8;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
        }

        /* Next Steps Section */
        .next-steps {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            margin: 30px 0;
            text-align: left;
        }

        .next-steps h3 {
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 20px 0;
            text-align: center;
        }

        .step-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .step-item:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateX(5px);
        }

        .step-number {
            min-width: 30px;
            height: 30px;
            background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            color: #ffffff;
        }

        .step-content h4 {
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 5px 0;
        }

        .step-content p {
            color: #b8b8b8;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
        }

        /* Business Benefits Section */
        .benefits-section {
            margin: 40px 0;
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 25px;
        }

        .benefit-card {
            background: linear-gradient(135deg, rgba(0, 170, 255, 0.05) 0%, rgba(0, 136, 204, 0.05) 100%);
            border: 1px solid rgba(0, 170, 255, 0.2);
            border-radius: 16px;
            padding: 25px;
            text-align: left;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .benefit-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #00aaff, #0088cc);
        }

        .benefit-card:hover {
            transform: translateY(-5px);
            background: linear-gradient(135deg, rgba(0, 170, 255, 0.08) 0%, rgba(0, 136, 204, 0.08) 100%);
            box-shadow: 0 10px 30px rgba(0, 170, 255, 0.2);
        }

        .benefit-icon {
            font-size: 28px;
            margin-bottom: 15px;
            display: block;
        }

        .benefit-title {
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 10px 0;
        }

        .benefit-desc {
            color: #b8b8b8;
            font-size: 14px;
            margin: 0;
            line-height: 1.6;
        }

        /* CTA Section Enhancement */
        .cta-section {
            background: linear-gradient(135deg, rgba(0, 170, 255, 0.1) 0%, rgba(0, 136, 204, 0.1) 100%);
            border: 1px solid rgba(0, 170, 255, 0.3);
            border-radius: 20px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }

        .cta-section h3 {
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 15px 0;
        }

        .cta-section p {
            color: #b8b8b8;
            font-size: 14px;
            margin: 0 0 25px 0;
        }

        /* Footer Styles */
        .footer {
            text-align: center;
            padding: 40px 20px;
            font-size: 12px;
            color: #666666;
        }

        .footer a {
            color: #00aaff;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        /* Social Links */
        .social-links {
            margin: 20px 0;
        }

        .social-links a {
            display: inline-block;
            margin: 0 10px;
            padding: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }

        .social-links a:hover {
            background: rgba(0, 170, 255, 0.2);
            transform: scale(1.1);
        }

        /* Responsive Styles */
            @media screen and (max-width: 600px) {
                .email-card {
                    padding: 30px 25px;
                    border-radius: 16px;
                    margin: 10px;
                }

                .header {
                    font-size: 24px;
                }

                h1 {
                    font-size: 28px;
                }

                .success-card {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }

                .benefits-grid {
                    grid-template-columns: 1fr;
                }

                .cta-button {
                    padding: 14px 30px;
                    width: 80%;
                }

                .step-item {
                    flex-direction: column;
                    text-align: center;
                    gap: 10px;
                }

                .step-number {
                    align-self: center;
                }
            }

        /* Decorative Elements */
        .decorative-dots {
            position: absolute;
            top: 20px;
            right: 20px;
            opacity: 0.1;
        }

        .decorative-dots::before {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00aaff;
            border-radius: 50%;
            box-shadow: 
                10px 0 0 #00aaff,
                20px 0 0 #00aaff,
                0 10px 0 #00aaff,
                10px 10px 0 #00aaff,
                20px 10px 0 #00aaff,
                0 20px 0 #00aaff,
                10px 20px 0 #00aaff,
                20px 20px 0 #00aaff;
        }
    </style>
</head>

<body>
    <!-- Preheader Text (Hidden) -->
    <div
        style="display:none;font-size:1px;color:#0f0f0f;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        Akun Anda telah berhasil dibuat. Selamat datang di keluarga SiCuan!
    </div>

    <table width="100%" border="0" cellpadding="0" cellspacing="0"
        style="background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%); padding: 40px 10px;">
        <tr>
            <td>
                <!-- Header -->
                <table class="email-container" border="0" cellpadding="0" cellspacing="0" align="center">
                    <tr>
                        <td class="header">
                            SICUAN
                        </td>
                    </tr>
                </table>

                <!-- Main Content Card -->
                <table class="email-container" border="0" cellpadding="0" cellspacing="0" align="center">
                    <tr>
                        <td class="email-card">
                            <!-- Decorative Elements -->
                            <div class="decorative-dots"></div>
                            
                            <!-- Logo with Glow Effect -->
                            <div class="logo-container">
                                <div class="logo-glow"></div>
                                <svg class="logo-svg" xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 24 24"
                                    fill="none" stroke="#00aaff" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5"/>
                                    <path d="M2 12l10 5 10-5"/>
                                </svg>
                            </div>

                            <!-- Main Heading -->
                            <h1>Selamat Datang di Keluarga SiCuan!</h1>

                            <!-- Welcome Message -->
                            <p>
                                Halo <span class="highlight-text">${username}</span> dari <strong class="highlight-text">${nama_usaha}</strong>,
                            </p>
                            <p>
                                Terima kasih telah mempercayai <strong>SiCuan</strong> sebagai partner teknologi bisnis Anda. Akun Anda telah berhasil dibuat dan kami sangat antusias untuk membantu <strong>${nama_usaha}</strong> mencapai level kesuksesan yang baru.
                            </p>
                            
                            <!-- Success Message Card -->
                            <div class="success-card">
                                <div class="success-icon">✔</div>
                                <div class="success-content">
                                    <h3>Akun Berhasil Dibuat!</h3>
                                    <p>Selamat! Akun SiCuan untuk <strong>${nama_usaha}</strong> telah aktif dan siap digunakan.</p>
                                </div>
                            </div>

                            <!-- Next Steps Section -->
                            <div class="next-steps">
                                <h3>Langkah Selanjutnya untuk ${nama_usaha}</h3>
                                <div class="step-item">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <h4>Akses Dashboard</h4>
                                        <p>Login ke dashboard SiCuan dan eksplorasi fitur-fitur yang tersedia untuk bisnis Anda</p>
                                    </div>
                                </div>
                                <div class="step-item">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <h4>Kustomisasi Profil</h4>
                                        <p>Lengkapi profil ${nama_usaha} dan sesuaikan pengaturan sesuai kebutuhan bisnis</p>
                                    </div>
                                </div>
                                <div class="step-item">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <h4>Hubungi Tim Support</h4>
                                        <p>Dapatkan panduan personal untuk memaksimalkan potensi SiCuan bagi ${nama_usaha}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Business Benefits Section -->
                            <div class="benefits-section">
                                <h3 style="color: #ffffff; text-align: center; font-size: 22px; margin-bottom: 15px;">
                                    Keuntungan SiCuan untuk ${nama_usaha}
                                </h3>
                                <div class="benefits-grid">
                                    <div class="benefit-card">
                                        <div class="benefit-icon">💼</div>
                                        <div class="benefit-title">Manajemen Bisnis Terpadu</div>
                                        <div class="benefit-desc">Kelola semua aspek bisnis ${nama_usaha} dalam satu platform yang terintegrasi</div>
                                    </div>
                                    <div class="benefit-card">
                                        <div class="benefit-icon">📊</div>
                                        <div class="benefit-title">Analitik Real-time</div>
                                        <div class="benefit-desc">Pantau performa bisnis dengan data dan insight yang akurat</div>
                                    </div>
                                    <div class="benefit-card">
                                        <div class="benefit-icon">🔐</div>
                                        <div class="benefit-title">Keamanan Terjamin</div>
                                        <div class="benefit-desc">Data ${nama_usaha} dilindungi dengan enkripsi tingkat enterprise</div>
                                    </div>
                                    <div class="benefit-card">
                                        <div class="benefit-icon">⚡</div>
                                        <div class="benefit-title">Otomasi Proses</div>
                                        <div class="benefit-desc">Automatisasi tugas berulang untuk efisiensi maksimal</div>
                                    </div>
                                </div>
                            </div>

                            <!-- CTA Section -->
                            <div class="cta-section">
                                <h3>Siap Memulai Perjalanan Sukses?</h3>
                                <p>Tim ahli kami siap membantu ${nama_usaha} mengoptimalkan penggunaan SiCuan</p>
                                
                                <!-- Call to Action Button -->
                                <a href="https://wa.me/6285947354250?text=${encodedMessage}" class="cta-button"
                                    style="color: #ffffff;">💬 Hubungi Tim Support</a>
                            </div>

                            <!-- Closing -->
                            <p style="margin-top: 30px; margin-bottom: 0; font-size: 18px;">
                                Salam Sukses,<br>
                                <strong style="color: #00aaff;">Tim SiCuan</strong>
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table class="email-container" border="0" cellpadding="0" cellspacing="0" align="center">
                    <tr>
                        <td class="footer">
                            <!-- Social Links -->
                            <div class="social-links">
                                <a href="#">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#00aaff">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                    </svg>
                                </a>
                                <a href="#">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#00aaff">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                    </svg>
                                </a>
                                <a href="#">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#00aaff">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.098.119.112.222.085.343-.09.383-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                                    </svg>
                                </a>
                            </div>
                            
                            <p style="margin: 0 0 15px; font-size: 12px; color: #666;">
                                Anda menerima email ini karena Anda telah mendaftar di SiCuan.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #666;">
                                © 2025 SiCuan. Semua Hak Cipta Dilindungi. | 
                                <a href="#">Privacy Policy</a> | 
                                <a href="#">Terms of Service</a>
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

const sendEmail = async (to, subject, otp, username, nama_usaha, type) => {
  try {
    const htmlContent =
      type === "otp"
        ? generateOtpEmailTemplate(otp, to)
        : generateWelcomeEmailTemplate(username, nama_usaha, to);

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
