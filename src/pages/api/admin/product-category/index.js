import pool from '../../../../../lib/db';

export default async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const [rows] = await pool.query(
            'SELECT id, name FROM product_category ORDER BY name ASC'
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
