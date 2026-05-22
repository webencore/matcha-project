import pool from '../../../../../lib/db';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const config = { api: { bodyParser: false } };

/* ================= S3 Client ================= */
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/* ================= Upload Helper ================= */
/**
 * Uploads file buffer to S3
 * @returns {string} filename only (not full URL)
 */
const uploadFileToS3 = async (buffer, key, type) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: type,
    });

    await s3Client.send(command);

    // return only filename
    return key.split('/').pop();
};

/* ================= Helper ================= */
const getFieldValue = (field) => {
    if (Array.isArray(field)) return field[0];
    return field ?? null;
};

/* ================= API Handler ================= */
export default async function handler(req, res) {
    try {

        /* ================= GET ================= */
        if (req.method === 'GET') {
            const [rows] = await pool.query(`SELECT * FROM employee ORDER BY sr_number ASC`);
            return res.status(200).json(rows);
        }

        /* ================= POST ================= */
        if (req.method === 'POST') {
            console.log("CONTENT TYPE 👉", req.headers['content-type']);

            const form = formidable({ multiples: false });

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error("FORM PARSE ERROR ❌", err);
                    return res.status(400).json({ error: err.message });
                }

                try {
                    console.log("FIELDS RECEIVED 👉", fields);
                    console.log("FILES RECEIVED 👉", files);

                    /* ===== Extract Fields ===== */
                    const name = getFieldValue(fields.name);
                    const designation = getFieldValue(fields.designation);
                    const hobby = getFieldValue(fields.hobby);
                    const linkedin_profile = getFieldValue(fields.linkedin_profile);
                    const joining_date = getFieldValue(fields.joining_date);
                    const about = getFieldValue(fields.about);
                    const sr_number = getFieldValue(fields.sr_number);

                    let imageName = null;

                    /* ===== Image Handling ===== */
                    const imageFile = Array.isArray(files.image)
                        ? files.image[0]
                        : files.image;

                    if (imageFile) {
                        console.log("IMAGE FILE 👉", imageFile);

                        // Read file buffer
                        const buffer = fs.readFileSync(imageFile.filepath);

                        // Get extension (.jpg, .png, etc)
                        const ext = path.extname(imageFile.originalFilename);

                        // Create S3 filename
                        const s3FileName = `${Date.now()}${ext}`;

                        // S3 key (folder + filename)
                        const s3Key = `employee/${s3FileName}`;

                        // Upload to S3
                        const uploadedFileName = await uploadFileToS3(
                            buffer,
                            s3Key,
                            imageFile.mimetype
                        );

                        // store only filename in DB
                        imageName = uploadedFileName;

                        console.log("S3 UPLOADED 👉", imageName);
                    }

                    /* ===== DB Insert ===== */
                    const [result] = await pool.query(
                        `INSERT INTO employee
                        (name, designation, hobby, image, linkedin_profile, joining_date, about, sr_number)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            name,
                            designation,
                            hobby,
                            imageName,
                            linkedin_profile,
                            joining_date,
                            about,
                            sr_number
                        ]
                    );

                    console.log("DB INSERT RESULT 👉", result);

                    return res.status(201).json({
                        success: true,
                        message: "Employee created successfully",
                        insertId: result.insertId,
                        image: imageName,
                        image_url: imageName
                            ? `${process.env.NEXT_PUBLIC_AWS_URL}/employee/${imageName}`
                            : null
                    });

                } catch (error) {
                    console.error("SERVER ERROR ❌", error);
                    return res.status(500).json({ error: 'Server error' });
                }
            });

            return;
        }

        /* ================= METHOD NOT ALLOWED ================= */
        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error("API ERROR ❌", error);
        return res.status(500).json({ error: 'Server error' });
    }
}
