import pool from '../../../../../lib/db';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const config = { api: { bodyParser: false } };

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getField = (f) => (Array.isArray(f) ? f[0] : f);

const uploadToS3 = async (buffer, key, type) => {
    const cmd = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: type,
    });
    await s3.send(cmd);
    return key.split('/').pop();
};

const deleteFromS3 = async (filename) => {
    if (!filename) return;

    const cmd = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `employee/${filename}`,
    });

    await s3.send(cmd);
};

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        /* ===== GET SINGLE ===== */
        if (req.method === "GET") {
            const [rows] = await pool.query(
                `SELECT * FROM employee WHERE id=?`,
                [id]
            );

            if (!rows.length)
                return res.status(404).json({ error: "Employee not found" });

            return res.status(200).json(rows[0]);
        }

        /* ===== UPDATE ===== */
        if (req.method === "PUT") {
            const form = formidable({ multiples: false });

            form.parse(req, async (err, fields, files) => {
                if (err) return res.status(400).json({ error: err.message });

                const [rows] = await pool.query(
                    `SELECT * FROM employee WHERE id=?`,
                    [id]
                );

                if (!rows.length)
                    return res.status(404).json({ error: "Employee not found" });

                const old = rows[0];
                let imageName = old.image;

                const imageFile = Array.isArray(files.image)
                    ? files.image[0]
                    : files.image;

                if (imageFile) {
                    await deleteFromS3(old.image);

                    const buffer = fs.readFileSync(imageFile.filepath);
                    const ext = path.extname(imageFile.originalFilename);
                    const fileName = `${Date.now()}${ext}`;
                    const key = `employee/${fileName}`;

                    imageName = await uploadToS3(
                        buffer,
                        key,
                        imageFile.mimetype
                    );
                }

                await pool.query(
                    `UPDATE employee
           SET name=?, designation=?, hobby=?, image=?,
               linkedin_profile=?, joining_date=?, about=?, sr_number=?
           WHERE id=?`,
                    [
                        getField(fields.name),
                        getField(fields.designation),
                        getField(fields.hobby),
                        imageName,
                        getField(fields.linkedin_profile),
                        getField(fields.joining_date),
                        getField(fields.about),
                        getField(fields.sr_number),
                        id,
                    ]
                );

                return res.status(200).json({ success: true });
            });

            return;
        }

        /* ===== DELETE ===== */
        if (req.method === "DELETE") {
            const [rows] = await pool.query(
                `SELECT * FROM employee WHERE id=?`,
                [id]
            );

            if (!rows.length)
                return res.status(404).json({ error: "Employee not found" });

            if (rows[0].image) {
                await deleteFromS3(rows[0].image);
            }

            await pool.query(`DELETE FROM employee WHERE id=?`, [id]);

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}