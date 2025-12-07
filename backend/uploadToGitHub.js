// backend/uploadToGitHub.js
const axios = require("axios");
const { v4: uuid } = require("uuid");

module.exports = async function uploadToGitHub(file, folder) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error("Missing GitHub environment variables");
  }

  const releaseTag = "app-files"; // 固定一个 tag，用来存所有资源
  const fileName = `${folder}-${uuid()}-${file.originalname}`;

  // ---------- Step 1: 获取或创建 Release ----------
  let release;
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/releases/tags/${releaseTag}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "app-store-backend"
        }
      }
    );
    release = res.data;
  } catch (e) {
    // Release 不存在就创建一个新的
    const res = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      {
        tag_name: releaseTag,
        name: "App Files Storage",
        draft: false,
        prerelease: false
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "app-store-backend"
        }
      }
    );
    release = res.data;
  }

  const uploadUrl = release.upload_url.replace("{?name,label}", "");

  // ---------- Step 2: 上传文件为 Release Asset ----------
  try {
    const res = await axios.post(
      `${uploadUrl}?name=${encodeURIComponent(fileName)}`,
      file.buffer,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": file.mimetype || "application/octet-stream",
          "Content-Length": file.buffer.length,
          "User-Agent": "app-store-backend"
        },
        // 允许大文件（APK）
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 0 // 不设置超时，让 Render 自己控制
      }
    );

    console.log("GitHub upload success:", res.data.browser_download_url);
    return res.data.browser_download_url;
  } catch (e) {
    console.error(
      "GitHub upload error:",
      e.response?.status,
      e.response?.data || e.message
    );
    throw new Error(
      e.response?.data?.message ||
        `GitHub upload failed: ${e.response?.status || ""} ${e.message}`
    );
  }
};
