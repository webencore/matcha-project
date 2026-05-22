import svgCaptcha from "svg-captcha";
import crypto from "crypto";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET allowed" });
  }

  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: "#f4f4f4",
  });

  const payload = {
    text: captcha.text,
    exp: Date.now() + 10 * 60 * 1000, // 10 minutes
  };

  const payloadString = JSON.stringify(payload);

  const signature = crypto
    .createHmac("sha256", process.env.CAPTCHA_SECRET)
    .update(payloadString)
    .digest("hex");

  const captchaToken =
    signature + "." + Buffer.from(payloadString).toString("base64");

  res.status(200).json({
    svg: captcha.data,
    captchaToken,
  });
}
