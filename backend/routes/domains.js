// backend/routes/domains.js
const express = require("express");
const { Domain } = require("../models");
const { checkCnamePointingTo } = require("../lib/dnsCheck");

const router = express.Router();

// list
router.get("/", async (req, res) => {
  const domains = await Domain.findAll({ order: [["createdAt", "DESC"]] });
  res.json({ domains });
});

// create (add)
router.post("/", async (req, res) => {
  try {
    const { domain, owner } = req.body;
    if (!domain) return res.status(400).json({ error: "domain is required" });

    const existing = await Domain.findOne({ where: { domain } });
    if (existing) return res.status(400).json({ error: "domain already exists" });

    const d = await Domain.create({ domain, owner, status: "pending" });
    res.json({ domain: d });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "create failed" });
  }
});

// verify
router.post("/:id/verify", async (req, res) => {
  try {
    const id = req.params.id;
    const row = await Domain.findByPk(id);
    if (!row) return res.status(404).json({ error: "not found" });

    // 可从 env 取 r2 target substring，比如 R2_ACCOUNT_ENDPOINT 或 R2_ACCOUNT_ID
    const r2Target = process.env.R2_ACCOUNT_ENDPOINT_SUBSTR || process.env.R2_ACCOUNT_ID || "r2.cloudflarestorage.com";

    const result = await checkCnamePointingTo(row.domain, r2Target);
    row.lastCheckedAt = new Date();
    row.lastMessage = result.message;
    row.status = result.ok ? "verified" : "failed";
    await row.save();

    res.json({ ok: result.ok, message: result.message, domain: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "verify failed" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const row = await Domain.findByPk(id);
    if (!row) return res.status(404).json({ error: "not found" });
    await row.destroy();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "delete failed" });
  }
});

module.exports = router;
