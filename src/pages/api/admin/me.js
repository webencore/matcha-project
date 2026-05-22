// pages/api/admin/me.js
import jwt from "jsonwebtoken";

export default function handler(req, res) {
    const token = req.cookies.admin_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json(decoded);
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}
