import AWS from "aws-sdk";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadToS3 = async (file) => {
    const ext = path.extname(file.originalFilename);
    const fileName = `product-${Date.now()}${ext}`;

    const fileContent = fs.readFileSync(file.filepath);

    await s3
        .upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `products/${fileName}`,
            Body: fileContent,
            ContentType: file.mimetype,
        })
        .promise();

    return fileName; // ✅ only filename saved to DB
};

export const deleteFromS3 = async (fileUrl) => {
    if (!fileUrl) return;

    const key = fileUrl.split(".com/")[1];

    await s3
        .deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
        })
        .promise();
};
