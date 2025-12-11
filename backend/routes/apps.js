// backend/routes/apps.js
const express = require("express");
const multer = require("multer");
const { uploadBufferToR2 } = require("../uploadToR2"); // upload helper we made earlier
const { App, Domain } = require("../models");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 创建 app
router.post("/create", async (req, res) => {
  try {
    const app = await App.create(req.body);
    res.json({ app });
  } catch (err) {
    console.error("create app error:", err);
    res.status(500).json({ error: err.message || "create failed" });
  }
});

// 上传文件（icon / apk / screenshot / desktopIcon / banner）
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { appId, type } = req.body;
    if (!appId) return res.status(400).json({ error: "appId is required" });

    const app = await App.findByPk(appId);
    if (!app) return res.status(404).json({ error: "app not found" });

    if (!req.file) return res.status(400).json({ error: "no file" });

    console.log("Uploading file for app:", appId, "type:", type, "name:", req.file.originalname);

    // 选择 folder（更清晰的对象路径）
    const folderMap = {
      apk: "apk",
      icon: "icon",
      desktopIcon: "desktop-icon",
      banner: "banner",
      screenshot: "screenshot"
    };
    const folder = folderMap[type] || "";

    // 上传到 R2（uploadBufferToR2 返回 { publicUrl, key }）
    const { publicUrl, key } = await uploadBufferToR2(req.file.buffer, req.file.originalname, req.file.mimetype, folder);

    // 构造最终对外 url：优先使用用户的 verified custom domain（如果存在且已验证）
    let finalUrl = publicUrl;
    if (app.landingDomain) {
      try {
        const domainRow = await Domain.findOne({ where: { domain: app.landingDomain } });
        if (domainRow && domainRow.status === "verified") {
          // key 已含 folder 前缀（因为 uploadBufferToR2 用 folder 参数），所以直接拼接 key
          finalUrl = `https://${app.landingDomain}/${encodeURIComponent(key)}`;
        } else {
          // 如果域名未验证，则使用 publicUrl（并在日志中标注）
          console.log(`[upload] landingDomain present but not verified: ${app.landingDomain}`);
        }
      } catch (e) {
        console.error("[upload] domain lookup failed:", e);
      }
    }

    // 根据 type 保存到 model 中（同时写入 URL 与 key）
    if (type === "apk") {
      app.apkUrl = finalUrl;
      app.apkKey = key;
    } else if (type === "icon") {
      app.iconUrl = finalUrl;
      app.iconKey = key;
    } else if (type === "desktopIcon") {
      app.desktopIconUrl = finalUrl;
      app.desktopIconKey = key;
    } else if (type === "banner") {
      app.bannerUrl = finalUrl;
      app.bannerKey = key;
    } else if (type === "screenshot") {
      // append key to screenshotKeys_jsonb (array)
      const oldKeys = Array.isArray(app.screenshotKeys_jsonb) ? app.screenshotKeys_jsonb : [];
      app.screenshotKeys_jsonb = [...oldKeys, key];

      // append url to screenshots (backwards compat)
      const oldScreens = Array.isArray(app.screenshots) ? app.screenshots : [];
      app.screenshots = [...oldScreens, publicUrl];
    } else {
      // 如果未知类型，存到 note 里以便排查（不阻塞）
      app.note = (app.note || "") + `\n[upload] unknown type ${type} saved at ${publicUrl}`;
    }

    await app.save();
    console.log("Upload success, url =", finalUrl, "key =", key);

    res.json({ url: finalUrl, key, app });
  } catch (e) {
    console.error("Upload error:", e);
    // 如果是 AWS/SDK 类型的错误，可能有详细信息在 e.$metadata 或 e.message
    const msg = e?.message || JSON.stringify(e);
    res.status(500).json({ error: msg });
  }
});

// 列表
router.get("/list", async (req, res) => {
  try {
    const apps = await App.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ apps });
  } catch (err) {
    console.error("list apps error:", err);
    res.status(500).json({ error: err.message || "list failed" });
  }
});

// 获取单个
router.get("/:id", async (req, res) => {
  try {
    const app = await App.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: "not found" });
    res.json({ app });
  } catch (err) {
    console.error("get app error:", err);
    res.status(500).json({ error: err.message || "get failed" });
  }
});

// 更新应用
router.put("/:id", async (req, res) => {
  try {
    const app = await App.findByPk(req.params.id);
    if (!app) {
      return res.status(404).json({ error: "app not found" });
    }

    await app.update(req.body);
    res.json({ app });
  } catch (e) {
    console.error("update app error:", e);
    res.status(500).json({ error: e.message || "update failed" });
  }
});

module.exports = router;
