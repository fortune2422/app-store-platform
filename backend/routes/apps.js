
const express = require("express");
const multer = require("multer");
const uploadToR2 = require("../uploadToR2");
const { App } = require("../models");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", async (req, res) => {
  const app = await App.create(req.body);
  res.json({ app });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  const { appId, type } = req.body;
  const app = await App.findByPk(appId);
  if (!app) return res.status(404).end();

  const url = await uploadToR2(req.file, type);
  if (type === "apk") app.apkUrl = url;
  if (type === "icon") app.iconUrl = url;
  if (type === "screenshot") app.screenshots = [...app.screenshots, url];
  await app.save();
  res.json({ url });
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
