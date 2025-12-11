// backend/uploadToR2.js (核心片段)
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("./r2");
const { v4: uuidv4 } = require("uuid");

const BUCKET = process.env.R2_BUCKET;
let PUBLIC_BASE = (process.env.STORAGE_PUBLIC_BASE_URL || "").replace(/\/$/, ""); // no trailing slash
const ACCOUNT_ENDPOINT = process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

async function uploadBufferToR2(fileBuffer, originalName, contentType, folder = "") {
  const safeName = originalName.replace(/\s+/g, "-");
  const key = `${folder ? folder.replace(/\/$/,"") + "/" : ""}${uuidv4()}-${safeName}`;

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
  });
  await s3.send(cmd);

  // 如果用户没有配置 STORAGE_PUBLIC_BASE_URL，默认回退到 account endpoint 包含 bucket
  if (!PUBLIC_BASE) {
    return {
      publicUrl: `${ACCOUNT_ENDPOINT}/${BUCKET}/${encodeURI(key)}`,
      key
    };
  }

  // 如果 PUBLIC_BASE 看起来像 account endpoint（包含 ".r2.cloudflarestorage.com"）
  // 我们也返回 PUBLIC_BASE + /BUCKET/... 以避免出错
  if (PUBLIC_BASE.includes(".r2.cloudflarestorage.com") || !PUBLIC_BASE.includes(BUCKET)) {
    // 如果 PUBLIC_BASE 已经包含 bucket（如你手动设置了 .../app-store-db），不要重复添加
    if (PUBLIC_BASE.endsWith(`/${BUCKET}`)) {
      return { publicUrl: `${PUBLIC_BASE}/${encodeURI(key)}`, key };
    }
    // 否则把 bucket 插入路径
    return { publicUrl: `${PUBLIC_BASE}/${BUCKET}/${encodeURI(key)}`, key };
  }

  // 默认： PUBLIC_BASE 已映射到 bucket root（例如 https://googleplaystoreuu.xyz），直接使用 key
  return { publicUrl: `${PUBLIC_BASE}/${encodeURI(key)}`, key };
}

module.exports = {
  uploadBufferToR2
};
