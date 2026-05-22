import svgCaptcha from "svg-captcha";
import crypto from "crypto";


/**
 * In-memory captcha store
 * key = captchaId
 */
export const captchaStore = {};

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

  const captchaId = crypto.randomUUID();

  captchaStore[captchaId] = {
    text: captcha.text,
    expires: Date.now() + 10 * 60 * 1000, // 2 minutes
  };

  res.status(200).json({
    captchaId,
    svg: captcha.data,
  });
}
