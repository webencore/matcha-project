import pool from "../../../../lib/db";

export default async function handler(req, res) {
    const { slug } = req.query;

    try {
        const [rows] = await pool.query(
            `
            SELECT 
                p.id,
                p.name,
                p.slug,
                p.extra_data,
                pc.name AS category_name
            FROM product p
            JOIN product_category pc ON p.product_category_id = pc.id
            WHERE p.slug = ?
            `,
            [slug]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (rows.length > 0 && typeof rows[0].extra_data != "object"){
            // convert extra_data to OBJECT            
            rows[0].extra_data = JSON.parse(rows[0].extra_data);
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database query failed" });
    }
}
