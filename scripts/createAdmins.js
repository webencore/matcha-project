import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Admins Data
const admins = [
    {
        name: "Manish Jain",
        email: "hncoorganics@gmail.com",
        password: "Online@135",
        phone: "9227009797",
    },
    {
        name: "Vaishali Bhatt",
        email: "vaishali.bhatt@herbsandcrops.in",
        password: "Bhatt@2468",
        phone: "9081509797",
    },
    {
        name: "Swati Sachan",
        email: "branding@ayurveda-distributor.com",
        password: "Sachan@864",
        phone: "8141397974",
    },
];

async function createAdmins() {
    try {
        for (const admin of admins) {
            // Check if email already exists
            const [existing] = await pool.execute(
                "SELECT id FROM admins WHERE email = ?",
                [admin.email]
            );

            if (existing.length > 0) {
                console.log(`⚠️ Skipping ${admin.email} (already exists)`);
                continue;
            }

            // Hash password
            const passwordHash = await bcrypt.hash(admin.password, 10);

            // Insert admin
            await pool.execute(
                "INSERT INTO admins (name, email, password, phone) VALUES (?, ?, ?, ?)",
                [admin.name, admin.email, passwordHash, admin.phone]
            );

            console.log(`✅ Created admin: ${admin.email}`);
        }

        console.log("🎉 All admins processed successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeder error:", error);
        process.exit(1);
    }
}

createAdmins();
