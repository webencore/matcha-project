import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../../../../lib/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;

    const [rows] = await pool.query(
        "SELECT * FROM admins WHERE email = ?",
        [email]
    );

    if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ INCLUDE ADMIN DATA IN JWT
    const token = jwt.sign(
        {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.setHeader(
        "Set-Cookie",
        `admin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    );

    return res.status(200).json({ message: "Login successful" });
}
