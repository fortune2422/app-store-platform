
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("./r2");
const { v4: uuid } = require("uuid");

module.exports = async function uploadToR2(file, folder) {
  const key = `${folder}/${uuid()}-${file.originalname}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  }));
  return `${process.env.R2_PUBLIC_URL}/${key}`;
};
