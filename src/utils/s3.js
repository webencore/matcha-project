import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (fileBuffer, fileName, fileType) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: fileType,
        ACL: 'public-read',
    };
    const data = await s3.upload(params).promise();
    return data; // returns { Location, Key, ... }
};

export const deleteFileFromS3 = async (key) => {
    if (!key) return;
    await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).promise();
};
