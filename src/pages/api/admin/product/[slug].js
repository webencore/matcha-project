import pool from '../../../../../lib/db';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const config = { api: { bodyParser: false } };

/* ================= S3 Client ================= */
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/* ================= Helpers ================= */
const getField = (f) => (Array.isArray(f) ? f[0] : f);

const uploadToS3 = async (buffer, key, type) => {
    const cmd = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: type
    });
    await s3Client.send(cmd);
    return key.split('/').pop(); // only filename
};

const deleteFromS3 = async (filename) => {
    if (!filename) return;

    const cmd = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `hnco-infusions/products/${filename}`
    });

    await s3Client.send(cmd);
};

/* ================= Handler ================= */
export default async function handler(req, res) {
    const { slug } = req.query;

    try {

        /* ========== GET SINGLE PRODUCT (BY SLUG) ========== */
        if (req.method === 'GET') {
            const [rows] = await pool.query(
                `SELECT * FROM product WHERE slug = ? LIMIT 1`,
                [slug]
            );

            if (!rows.length) {
                return res.status(404).json({ error: 'Product not found' });
            }

            return res.status(200).json(rows[0]);
        }

        /* ========== UPDATE PRODUCT (BY SLUG) ========== */
        if (req.method === 'PUT') {
            const form = formidable({ multiples: false });

            form.parse(req, async (err, fields, files) => {
                if (err) return res.status(400).json({ error: err.message });

                try {
                    const name = getField(fields.name);
                    const product_category_id = getField(fields.product_category_id);

                    const [rows] = await pool.query(
                        `SELECT * FROM product WHERE slug = ? LIMIT 1`,
                        [slug]
                    );

                    if (!rows.length) {
                        return res.status(404).json({ error: 'Product not found' });
                    }

                    const oldProduct = rows[0];
                    let newSlug = oldProduct.slug;
                    let imageName = oldProduct.image;

                    /* ===== Slug regen if name changed ===== */
                    if (name && name !== oldProduct.name) {
                        newSlug = slugify(name, { lower: true });
                    }

                    /* ===== Image update ===== */
                    const imageFile = Array.isArray(files.image)
                        ? files.image[0]
                        : files.image;

                    if (imageFile) {
                        // delete old image from S3
                        if (oldProduct.image) {
                            await deleteFromS3(oldProduct.image);
                        }

                        const buffer = fs.readFileSync(imageFile.filepath);
                        const ext = path.extname(imageFile.originalFilename);
                        const s3Name = `${newSlug}${ext}`;
                        const s3Key = `hnco-infusions/products/${s3Name}`;

                        imageName = await uploadToS3(buffer, s3Key, imageFile.mimetype);
                    }

                    /* ===== DB Update ===== */
                    await pool.query(
                        `UPDATE product 
             SET name=?, product_category_id=?, slug=?, image=?
             WHERE slug=?`,
                        [
                            name || oldProduct.name,
                            product_category_id || oldProduct.product_category_id,
                            newSlug,
                            imageName,
                            slug
                        ]
                    );

                    return res.status(200).json({
                        success: true,
                        message: 'Product updated successfully',
                        slug: newSlug,
                        image: imageName
                    });

                } catch (e) {
                    console.error("UPDATE ERROR ❌", e);
                    return res.status(500).json({ error: 'Server error' });
                }
            });

            return;
        }

        /* ========== DELETE PRODUCT (BY SLUG) ========== */
        if (req.method === 'DELETE') {
            const [rows] = await pool.query(
                `SELECT * FROM product WHERE slug = ? LIMIT 1`,
                [slug]
            );

            if (!rows.length) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const product = rows[0];

            
            /* ===== Delete image from S3 ===== */
            if (product.image) {
                await deleteFromS3(product.image);
            }

            /* ===== Delete DB row ===== */
            await pool.query(`DELETE FROM product WHERE slug = ?`, [slug]);

            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (err) {
        console.error("API ERROR ❌", err);
        return res.status(500).json({ error: 'Server error' });
    }
}
