// backend/uploadToR2.js
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("./r2");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const BUCKET = process.env.R2_BUCKET;
const PUBLIC_BASE = (process.env.STORAGE_PUBLIC_BASE_URL || "").replace(/\/$/, ""); // no trailing slash
const SIGNED_EXPIRES = parseInt(process.env.R2_SIGNED_URL_EXPIRES_SECONDS || "3600", 10);

async function uploadBufferToR2(fileBuffer, originalName, contentType, folder = "") {
  // 构建 key：folder/uuid-originalName
  const safeName = originalName.replace(/\s+/g, "-");
  const key = `${folder ? folder.replace(/\/$/,"") + "/" : ""}${uuidv4()}-${safeName}`;

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
    // Cloudflare R2 不使用 ACL 之类的参数
  });

  await s3.send(cmd);

  // 如果你已经把 custom domain 指向 bucket 并开启 public access，
  // 最终对外访问 URL 可以直接用 PUBLIC_BASE + /key
  if (PUBLIC_BASE) {
    return {
      publicUrl: `${PUBLIC_BASE}/${encodeURI(key)}`,
      key
    };
  }

  // 如果没有 custom domain，可以通过 R2 endpoint (account-based)
  const endpoint = process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  return {
    publicUrl: `${endpoint}/${BUCKET}/${encodeURI(key)}`,
    key
  };
}

// 如果你想要生成私有的签名 GET 链接（private bucket），用这个：
async function generateSignedGetUrl(key, expiresSeconds = SIGNED_EXPIRES) {
  const cmd = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: expiresSeconds });
  return url;
}

module.exports = {
  uploadBufferToR2,
  generateSignedGetUrl
};
