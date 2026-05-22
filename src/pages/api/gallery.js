import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export default async function handler(req, res) {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: "hnco-infusions/expo_images/",
        });

        const data = await s3.send(command);

        const images = data.Contents
            ?.filter(item => item.Key && !item.Key.endsWith("/"))
            .sort((a, b) => {
                const nameA = a.Key.split("/").pop().toLowerCase();
                const nameB = b.Key.split("/").pop().toLowerCase();

                // Natural sorting (handles numbers like 1,2,10 correctly)
                return nameA.localeCompare(nameB, undefined, { numeric: true });
            })
            .map(item => ({
                src: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
                name: item.Key.split("/").pop(),
            }));

        res.status(200).json(images || []);
    } catch (error) {
        console.error("S3 Fetch Error:", error);
        res.status(500).json({ error: error.message });
    }
}