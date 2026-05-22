import pool from "../../../../../lib/db";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
    api: {
        bodyParser: false, // We handle parsing ourselves
    },
};

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const [rows] = await pool.query("SELECT * FROM companies ORDER BY id DESC");
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server error" });
        }
    }

    if (req.method === "POST") {
        try {
            const form = formidable({ multiples: false });
            form.parse(req, async (err, fields, files) => {
                if (err) return res.status(500).json({ error: "File parsing error" });

                const { company_name, company_slug, company_website, status } = fields;
                let company_logo = null;

                if (files.company_logo) {
                    company_logo = `/uploads/${files.originalFilename}`;
                }

                const [result] = await pool.query(
                    "INSERT INTO companies (company_name, company_slug, company_logo, company_website, status) VALUES (?, ?, ?, ?, ?)",
                    [company_name, company_slug, company_logo, company_website, status]
                );

                return res.status(201).json({ success: true, id: result.insertId });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
