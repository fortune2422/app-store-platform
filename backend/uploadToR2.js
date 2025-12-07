// backend/uploadToR2.js
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("./r2");
const { v4: uuid } = require("uuid");

module.exports = async function uploadToR2(file, folder) {
  const key = `${folder}/${uuid()}-${file.originalname}`;
  console.log("uploadToR2 => bucket:", process.env.R2_BUCKET, "key:", key);

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  const url = `${process.env.R2_PUBLIC_URL}/${key}`;
  console.log("uploadToR2 => public url:", url);
  return url;
};
