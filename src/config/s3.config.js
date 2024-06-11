// Using Digital Ocean instead of AWS S3

const { S3, S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')

const s3Config = {
    endpoint: `https://${process.env.DO_REGION}.${process.env.DO_BUCKET_ENDPOINT}`,
    region: process.env.DO_REGION,
    credentials: {
        accessKeyId: process.env.DO_ACCESS_KEY,
        secretAccessKey: process.env.DO_SECRET_KEY,
    },
    forcePathStyle: true // Buộc sử dụng path style để tránh lỗi hostname
};

// const s3 = new S3(s3Config)
const s3 = new S3Client(s3Config)

module.exports = {
    s3,
    PutObjectCommand,
    GetObjectCommand, 
    DeleteObjectCommand
}