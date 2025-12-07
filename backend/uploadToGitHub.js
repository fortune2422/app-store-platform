// backend/uploadToGitHub.js
const axios = require("axios");
const { v4: uuid } = require("uuid");
const FormData = require("form-data");

module.exports = async function uploadToGitHub(file, folder) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error("Missing GitHub environment variables");
  }

  const releaseTag = "app-files"; // 固定一个 tag
  const fileName = `${folder}-${uuid()}-${file.originalname}`;

  // Step 1: 获取或创建 Release
  let release;
  try {
    release = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/releases/tags/${releaseTag}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    release = release.data;
  } catch (e) {
    // Release 不存在 → 创建
    const res = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      {
        tag_name: releaseTag,
        name: "App Files Storage",
        draft: false,
        prerelease: false,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    release = res.data;
  }

  const uploadUrl = release.upload_url.replace("{?name,label}", "");

  // Step 2: 上传文件为 Release Asset
  const res = await axios.post(
    `${uploadUrl}?name=${encodeURIComponent(fileName)}`,
    file.buffer,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": file.mimetype,
        "Content-Length": file.buffer.length,
      },
    }
  );

  // 返回永久下载链接
  return res.data.browser_download_url;
};
