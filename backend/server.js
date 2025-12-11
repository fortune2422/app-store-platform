// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models"); // 注意 models/index.js 要导出 sequelize
const config = require("./config");

// 非阻塞环境检查（提醒但不退出）
const required = ["R2_BUCKET", "DATABASE_URL"];
required.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`Warning: env ${k} is not set`);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

// 挂载路由（确保这些文件存在）
app.use("/api/apps", require("./routes/apps"));
app.use("/api/domains", require("./routes/domains")); // 新添加的域名管理路由

// ---- DB helper: 只做 "ADD COLUMN IF NOT EXISTS"，避免尝试改列类型 ----
async function ensureColumns() {
  const queries = [
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "apkKey" TEXT;`,
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "iconKey" TEXT;`,
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "desktopIconKey" TEXT;`,
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "bannerKey" TEXT;`,
    // 新增 JSONB 列以避免旧列类型转换问题（你后续可以迁移旧数据到这个列）
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "screenshotKeys_jsonb" JSONB DEFAULT '[]'::jsonb;`
  ];

  for (const q of queries) {
    try {
      await sequelize.query(q);
      console.log("[DB] ensured:", q);
    } catch (err) {
      console.error("[DB] failed running:", q, err.message || err);
      // 不退出：尽量让服务继续启动（但会记录错误）
    }
  }
}

// 启动流程：先确保列，再 sync，再启动 express
(async () => {
  try {
    console.log("[startup] ensuring DB columns...");
    await ensureColumns();

    console.log("[startup] syncing models (sequelize.sync)...");
    // 默认 sync()。如果 dev 环境需要自动 alter，可用 { alter: true }（生产慎用）
    await sequelize.sync();

    const port = config.PORT || process.env.PORT || 10000;
    app.listen(port, () => {
      console.log("Backend running on port", port);
    });
  } catch (err) {
    console.error("startup error:", err);
    process.exit(1);
  }
})();
