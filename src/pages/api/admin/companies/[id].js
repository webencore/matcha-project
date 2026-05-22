import pool from "../../../../../lib/db";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
    api: { bodyParser: false },
};

/* ---------------- VALIDATION (Laravel Style) ---------------- */
const validateCompany = (fields) => {
    const errors = {};

    if (!fields.company_name) {
        errors.company_name = "Company name is required";
    }

    if (!fields.company_slug || !fields.company_slug.trim()) {
        errors.company_slug = "Company slug is required";
    }

    if (fields.company_website && !/^https?:\/\//i.test(fields.company_website)) {
        errors.company_website = "Website must be a valid URL (http/https)";
    }

    if (fields.status && !["Active", "Inactive"].includes(fields.status)) {
        errors.status = "Invalid status value";
    }

    return errors;
};

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ success: false, message: "ID is required" });
    }

    /* ===================== UPDATE ===================== */
    if (req.method === "PUT") {
        const form = formidable({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Form parse failed" });
            }

            /* ---------- VALIDATION ---------- */
            const errors = validateCompany(fields);
            if (Object.keys(errors).length > 0) {
                return res.status(422).json({
                    success: false,
                    errors, // 👈 Laravel-style errors
                });
            }

            const { company_name, company_slug, company_website, status } = fields;

            let company_logo = null;
            if (files.company_logo) {
                company_logo = `/uploads/${files.company_logo.originalFilename}`;
            }

            const query = [];
            const params = [];

            if (company_name) {
                query.push("company_name = ?");
                params.push(company_name);
            }

            if (company_slug) {
                query.push("company_slug = ?");
                params.push(company_slug);
            }

            if (company_website) {
                query.push("company_website = ?");
                params.push(company_website);
            }

            if (status) {
                query.push("status = ?");
                params.push(status);
            }

            if (company_logo) {
                query.push("company_logo = ?");
                params.push(company_logo);
            }

            if (!query.length) {
                return res.status(400).json({
                    success: false,
                    message: "Nothing to update",
                });
            }

            try {
                await pool.query(
                    `UPDATE companies SET ${query.join(", ")} WHERE id = ?`,
                    [...params, id]
                );

                return res.status(200).json({
                    success: true,
                    message: "Company updated successfully",
                });
            } catch (dbError) {
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    sqlMessage: dbError.message,
                });
            }
        });
        return;
    }

    /* ===================== DELETE ===================== */
    if (req.method === "DELETE") {
        try {
            await pool.query("DELETE FROM companies WHERE id = ?", [id]);
            return res.status(200).json({
                success: true,
                message: "Company deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
}
