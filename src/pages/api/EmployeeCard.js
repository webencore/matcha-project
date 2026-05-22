import pool from "../../../lib/db";

export default async function handler(req, res) {
    try {
        const [rows] = await pool.query(`SELECT * FROM employee ORDER BY sr_number ASC`);

        res.status(200).json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database query failed" });
    }
}
