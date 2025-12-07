
const express = require("express");
const multer = require("multer");
const uploadToGitHub = require("../uploadToGitHub");
const { App } = require("../models");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", async (req, res) => {
  const app = await App.create(req.body);
  res.json({ app });
});

// backend/routes/apps.js
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { appId, type } = req.body;
    const app = await App.findByPk(appId);
    if (!app) return res.status(404).json({ error: "app not found" });

    if (!req.file) return res.status(400).json({ error: "no file" });

    console.log("Uploading file for app:", appId, "type:", type, "name:", req.file.originalname);

    const url = await uploadToGitHub(req.file, type);

    if (type === "apk") app.apkUrl = url;
    if (type === "icon") app.iconUrl = url;
    if (type === "screenshot") {
      app.screenshots = [...(app.screenshots || []), url];
    }

    await app.save();
    console.log("Upload success, url =", url);

    res.json({ url, app });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ error: e.message || "upload failed" });
  }
});


router.get("/list", async (req, res) => {
  const apps = await App.findAll();
  res.json({ apps });
});

router.get("/:id", async (req, res) => {
  const app = await App.findByPk(req.params.id);
  res.json({ app });
});

module.exports = router;
