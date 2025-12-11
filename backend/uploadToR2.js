// backend/uploadToR2.js
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("./r2");
const { v4: uuidv4 } = require("uuid");

const BUCKET = process.env.R2_BUCKET;
const PUBLIC_BASE = (process.env.STORAGE_PUBLIC_BASE_URL || "").replace(/\/$/, ""); // remove trailing slash

async function uploadBufferToR2(fileBuffer, originalName, contentType, folder = "") {
  // 生成 key：folder/uuid-filename
  const safeName = originalName.replace(/\s+/g, "-");
  const key = `${folder ? folder.replace(/\/$/, "") + "/" : ""}${uuidv4()}-${safeName}`;

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3.send(cmd);

  // Public bucket：直接返回公网可访问链接
  if (PUBLIC_BASE) {
    return {
      publicUrl: `${PUBLIC_BASE}/${encodeURI(key)}`,
      key
    };
  }

  // fallback：使用 R2 账号 endpoint
  const endpoint = process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  return {
    publicUrl: `${endpoint}/${BUCKET}/${encodeURI(key)}`,
    key
  };
}

module.exports = {
  uploadBufferToR2
};
