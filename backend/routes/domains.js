// backend/routes/domains.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { Domain } = require("../models");
const { checkTxtToken, checkCname } = require("../lib/dnsCheck");

const router = express.Router();

// GET /api/domains  -> 列出所有域名（可加 owner filter）
router.get("/", async (req, res) => {
  try {
    const where = {};
    if (req.query.owner) where.owner = req.query.owner;
    const domains = await Domain.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json({ domains });
  } catch (err) {
    console.error("list domains error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/domains  -> 添加域名（生成 token）
router.post("/", async (req, res) => {
  try {
    const { domain, owner } = req.body;
    if (!domain) return res.status(400).json({ error: "domain required" });

    // 生成短 token（也可以用更复杂的签名）
    const token = uuidv4().split("-")[0]; // 例如 '9f1b2c3d'
    const newDomain = await Domain.create({
      domain,
      owner: owner || null,
      token,
      status: "pending"
    });

    res.json({
      domain: newDomain,
      instructions: {
        // 告诉用户如何添加 TXT
        txtHost: `_appstore-verification.${domain}`,
        txtValue: token,
        note:
          "请在 DNS 管理面板为上面的主机名添加 TXT 记录，值为 token。添加后点击“检查验证”。"
      }
    });
  } catch (err) {
    console.error("create domain error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/domains/:id/verify -> 触发验证（同步检查 TXT；也可改为异步）
router.post("/:id/verify", async (req, res) => {
  try {
    const id = req.params.id;
    const domainRow = await Domain.findByPk(id);
    if (!domainRow) return res.status(404).json({ error: "domain not found" });

    const domain = domainRow.domain;
    const token = domainRow.token;

    // 首先检查 TXT token
    const txt = await checkTxtToken(domain, token);
    if (txt.ok) {
      domainRow.status = "verified";
      domainRow.lastCheckedAt = new Date();
      await domainRow.save();
      return res.json({ ok: true, verifiedBy: "txt", details: txt.details, domain: domainRow });
    }

    // 可选：如果你想支持 CNAME 验证，把 expectedTarget 从 env 或 config 里取
    if (process.env.DOMAIN_CNAME_TARGET) {
      const cname = await checkCname(domain, process.env.DOMAIN_CNAME_TARGET);
      if (cname.ok) {
        domainRow.status = "verified";
        domainRow.lastCheckedAt = new Date();
        await domainRow.save();
        return res.json({ ok: true, verifiedBy: "cname", details: cname.details, domain: domainRow });
      }
    }

    // 都没有通过
    domainRow.status = "pending";
    domainRow.lastCheckedAt = new Date();
    await domainRow.save();
    res.json({ ok: false, details: { txt, cname: process.env.DOMAIN_CNAME_TARGET ? "checked" : "skipped" }, domain: domainRow });
  } catch (err) {
    console.error("verify domain error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/domains/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const d = await Domain.findByPk(id);
    if (!d) return res.status(404).json({ error: "not found" });
    await d.destroy();
    res.json({ ok: true });
  } catch (err) {
    console.error("delete domain error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
