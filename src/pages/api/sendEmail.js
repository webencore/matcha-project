import nodemailer from "nodemailer";
import { captchaStore } from "./captcha";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    const { name, email, message, captcha, captchaId, company } = req.body;

    /* ================= HONEYPOT ================= */
    if (company) {
        return res.status(400).json({
            success: false,
            message: "Spam detected",
        });
    }

    /* ================= CAPTCHA VALIDATION ================= */
    if (!captchaId || !captchaStore[captchaId]) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired CAPTCHA",
        });
    }

    const storedCaptcha = captchaStore[captchaId];

    if (
        Date.now() > storedCaptcha.expires ||
        captcha.toLowerCase() !== storedCaptcha.text.toLowerCase()
    ) {
        delete captchaStore[captchaId];
        return res.status(400).json({
            success: false,
            message: "Invalid CAPTCHA",
        });
    }

    // Clear captcha after success
    delete captchaStore[captchaId];

    /* ================= SPAM KEYWORD FILTER ================= */
    const spamKeywords = [
        "seo",
        "backlink",
        "guest post",
        "digital marketing",
        "google ranking",
        "traffic",
    ];

    const content = `${name} ${email} ${message}`.toLowerCase();

    if (spamKeywords.some(word => content.includes(word))) {
        return res.status(400).json({
            success: false,
            message: "Message rejected",
        });
    }

    try {
        /* ================= MAIL TRANSPORTER ================= */
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true", // true for 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        /* ================= SEND EMAIL ================= */
        await transporter.sendMail({
            from: `"Website Contact" <${process.env.MAIL_FROM}>`,
            to: process.env.MAIL_TO,
            replyTo: email,
            subject: `New Contact Message from ${name} from DS Baverages Website`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Message:</b></p>
                <p>${message}</p>
            `,
        });

        return res.status(200).json({
            success: true,
            message: "Message sent successfully!",
        });

    } catch (error) {
        console.error("Email Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error sending message",
        });
    }
}

