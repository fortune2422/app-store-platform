// backend/r2.js
const { S3Client } = require("@aws-sdk/client-s3");

module.exports = new S3Client({
  region: "us-east-005", // Backblaze B2 的 region（根据你后台看到的填）
  endpoint: process.env.R2_ENDPOINT, // 确保是带 https:// 的完整地址
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY
  },
  forcePathStyle: true // B2 推荐加上这个，避免虚拟主机式 bucket
});
