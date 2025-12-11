// backend/routes/downloads.js
const express = require("express");
const { generateSignedGetUrl } = require("../uploadToR2");
const { App } = require("../models");

const router = express.Router();

// GET /api/downloads/apk/:id -> 返回一个签名的临时下载链接（如果 apkKey 存在）
router.get("/apk/:appId", async (req, res) => {
  try {
    const app = await App.findByPk(req.params.appId);
    if (!app || !app.apkKey) return res.status(404).json({ error: "apk not found" });

    const url = await generateSignedGetUrl(app.apkKey, 60 * 30); // 30min
    res.json({ url });
  } catch (e) {
    console.error("generate signed url error:", e);
    res.status(500).json({ error: e.message || "failed" });
  }
});

module.exports = router;
