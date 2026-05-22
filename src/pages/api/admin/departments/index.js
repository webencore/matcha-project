import pool from "../../../../../lib/db";

export default async function handler(req, res) {
  try {
    // GET → ALWAYS ARRAY
    if (req.method === "GET") {
      const [rows] = await pool.query(`
        SELECT d.id, d.company_id, d.department_name, d.status, c.company_name
        FROM departments d
        INNER JOIN companies c ON c.id = d.company_id
        ORDER BY d.id DESC
      `);

      return res.status(200).json(rows);
    }

    // POST → OBJECT
    if (req.method === "POST") {
      const { company_id, department_name, status } = req.body;

      if (!company_id || !department_name) {
        return res.status(400).json({ error: "Missing fields" });
      }

      await pool.query(
        `INSERT INTO departments (company_id, department_name, status)
         VALUES (?, ?, ?)`,
        [company_id, department_name, status || "Active"]
      );

      return res.status(201).json({ success: true });
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
