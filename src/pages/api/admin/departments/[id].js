import pool from "../../../../../lib/db";

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        // GET SINGLE
        if (req.method === "GET") {
            const [[company]] = await pool.query(
                "SELECT * FROM companies WHERE id=?",
                [id]
            );
            return res.status(200).json(company || {});
        }

        // UPDATE
        if (req.method === "PUT") {
            const { company_name, company_slug, company_website, status } = req.body;

            await pool.query(
                `UPDATE companies
         SET company_name=?, company_slug=?, company_website=?, status=?
         WHERE id=?`,
                [company_name, company_slug, company_website, status, id]
            );

            return res.json({ success: true });
        }

        // DELETE
        if (req.method === "DELETE") {
            await pool.query("DELETE FROM companies WHERE id=?", [id]);
            return res.json({ success: true });
        }

        res.status(405).json({ message: "Method not allowed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}
