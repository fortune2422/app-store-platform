// backend/routes/apps.js
const express = require("express");
const multer = require("multer");
const { uploadBufferToR2 } = require("../uploadToR2");
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

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { appId, type } = req.body;
    const app = await App.findByPk(appId);
    if (!app) return res.status(404).json({ error: "app not found" });

    if (!req.file) return res.status(400).json({ error: "no file" });

    console.log("Uploading file to R2:", appId, type, req.file.originalname);

    const { publicUrl } = await uploadBufferToR2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      type
    );

    if (type === "apk") app.apkUrl = publicUrl;
    if (type === "icon") app.iconUrl = publicUrl;
    if (type === "desktopIcon") app.desktopIconUrl = publicUrl;
    if (type === "banner") app.bannerUrl = publicUrl;
    if (type === "screenshot") {
      app.screenshots = [...(app.screenshots || []), publicUrl];
    }

    await app.save();

    res.json({ url: publicUrl, app });
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
