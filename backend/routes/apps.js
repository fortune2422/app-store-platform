// backend/routes/apps.js
const express = require("express");
const multer = require("multer");
const { uploadBufferToR2 } = require("../uploadToR2"); // 我们之前写好的上传模块
const { App } = require("../models");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", async (req, res) => {
  try {
    const app = await App.create(req.body);
    res.json({ app });
  } catch (e) {
    console.error("create app error:", e);
    res.status(500).json({ error: e.message || "create failed" });
  }
});

// 上传资源（文件通过 multipart/form-data 上传）
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { appId, type } = req.body;

    if (!req.file) return res.status(400).json({ error: "no file provided" });
    if (!appId) return res.status(400).json({ error: "no appId provided" });

    const app = await App.findByPk(appId);
    if (!app) return res.status(404).json({ error: "app not found" });

    console.log("Uploading file for app:", appId, "type:", type, "name:", req.file.originalname);

    // 上传到 R2，folder 用 type 区分
    const folder = type || "files";
    const { publicUrl, key } = await uploadBufferToR2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    // 根据 type 保存不同字段
    if (type === "apk") app.apkUrl = publicUrl;
    else if (type === "icon") app.iconUrl = publicUrl;
    else if (type === "desktopIcon") app.desktopIconUrl = publicUrl;
    else if (type === "banner") app.bannerUrl = publicUrl;
    else if (type === "screenshot") {
      app.screenshots = [...(app.screenshots || []), publicUrl];
    } else {
      // 默认也放到 screenshots（可按需改）
      app.screenshots = [...(app.screenshots || []), publicUrl];
    }

    await app.save();

    console.log("Upload success, url =", publicUrl);
    res.json({ url: publicUrl, key, app });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ error: e.message || "upload failed" });
  }
});

router.get("/list", async (req, res) => {
  try {
    const apps = await App.findAll({ order: [["id", "ASC"]] });
    res.json({ apps });
  } catch (e) {
    console.error("list apps error:", e);
    res.status(500).json({ error: e.message || "list failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const app = await App.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: "app not found" });
    res.json({ app });
  } catch (e) {
    console.error("get app error:", e);
    res.status(500).json({ error: e.message || "get failed" });
  }
});

// 更新应用
router.put("/:id", async (req, res) => {
  try {
    const app = await App.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: "app not found" });

    await app.update(req.body);
    res.json({ app });
  } catch (e) {
    console.error("update app error:", e);
    res.status(500).json({ error: e.message || "update failed" });
  }
});

module.exports = router;
