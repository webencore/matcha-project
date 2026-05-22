import nodemailer from "nodemailer";
import formidable from "formidable";
import crypto from "crypto";

export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST allowed" });
    }

    const form = formidable({
        maxFileSize: 5 * 1024 * 1024,
        keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            if (err.code === 1009 || err.message?.includes("maxFileSize")) {
                return res.status(400).json({
                    message: "File size exceeds 5MB limit",
                });
            }

            return res.status(400).json({
                message: "File upload failed",
            });
        }

        const name = fields.name?.toString();
        const email = fields.email?.toString();
        const phone = fields.phone?.toString();
        const position = fields.position?.toString();
        const current_ctc = fields.currentCtc?.toString();
        const message = fields.message?.toString();
        const company = fields.company?.toString();

        const captchaValue = fields.captcha?.toString();
        const captchaToken = fields.captchaToken?.toString();

        /* Honeypot */
        if (company && company.trim() !== "") {
            return res.status(400).json({ message: "Spam detected" });
        }

        /* CAPTCHA validation */
        if (!captchaValue || !captchaToken) {
            return res.status(400).json({ message: "CAPTCHA required" });
        }

        const [signature, encodedPayload] = captchaToken.split(".");
        if (!signature || !encodedPayload) {
            return res.status(400).json({ message: "Invalid CAPTCHA token" });
        }

        const payloadString = Buffer.from(encodedPayload, "base64").toString();

        const expectedSignature = crypto
            .createHmac("sha256", process.env.CAPTCHA_SECRET)
            .update(payloadString)
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({ message: "Invalid CAPTCHA" });
        }

        const { text, exp } = JSON.parse(payloadString);

        if (Date.now() > exp) {
            return res
                .status(400)
                .json({ message: "CAPTCHA expired. Please refresh." });
        }

        if (text.toLowerCase() !== captchaValue.toLowerCase()) {
            return res.status(400).json({ message: "Invalid CAPTCHA" });
        }

        /* Resume validation */
        let resume = files.resume;
        if (Array.isArray(resume)) resume = resume[0];

        if (!resume) {
            return res.status(400).json({ message: "Resume is required" });
        }

        if (
            resume.mimetype !== "application/pdf" &&
            !resume.originalFilename?.toLowerCase().endsWith(".pdf")
        ) {
            return res.status(400).json({ message: "Only PDF files allowed" });
        }

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"Careers" <${process.env.MAIL_FROM}>`,
                to: process.env.MAIL_TO,
                replyTo: email,
                subject: `Career Application - ${position} from DS Baverages Website`,
                html: `
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Position:</b> ${position}</p>
          <p><b>Current CTC:</b> ${current_ctc}</p>
          <p>${message || ""}</p>
        `,
                attachments: [
                    {
                        filename: resume.originalFilename,
                        path: resume.filepath,
                    },
                ],
            });

            res.status(200).json({ message: "Application submitted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Email failed" });
        }
    });
}

