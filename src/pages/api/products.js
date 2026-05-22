// pages/api/products.js
import pool from "../../../lib/db";

export default async function handler(req, res) {
    try {
        const { category } = req.query;

        let query = `
            SELECT 
                p.id,
                p.name,
                p.slug,
                p.image,
                p.extra_data,
                pc.name AS category_name
            FROM product p
            JOIN product_category pc ON p.product_category_id = pc.id
        `;

        const params = [];

        if (category) {
            query += " WHERE pc.name = ?";
            params.push(category);
        }

        const [rows] = await pool.query(query, params);

        // if(rows && rows.length > 0){
        //     for(let i=0; i< rows.length;i++){
        //         if(rows[i].extra_data){
        //             rows[i].extra_data = JSON.parse(rows[i].extra_data);
        //         }
        //     }
        // }
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database query failed" });
    }
}
