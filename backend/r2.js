// backend/r2.js
const { S3Client } = require("@aws-sdk/client-s3");

const endpoint = process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const s3 = new S3Client({
  region: "auto",
  endpoint,
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
  // 通过 Cloudflare R2 访问 OSS
});

module.exports = s3;
