// server.js
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const config = require("./config");

// 环境检查（非阻塞警告）
const required = ["R2_BUCKET", "R2_ACCESS_KEY", "R2_SECRET_KEY", "DATABASE_URL"];
required.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`Warning: env ${k} is not set`);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

// 挂载路由（保持你原来的路由装载位置）
app.use("/api/apps", require("./routes/apps"));

// ---- 数据库列保障（只做 ADD IF NOT EXISTS，不做 ALTER TYPE） ----
async function ensureColumns() {
  const queries = [
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "apkKey" TEXT;`,
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "iconKey" TEXT;`,
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "desktopIconKey" TEXT;`,
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "bannerKey" TEXT;`,
    // 不触碰已存在的 screenshotKeys，改为新增一个 JSONB 列以避免类型强制转换错误
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "screenshotKeys_jsonb" JSONB DEFAULT '[]'::jsonb;`
  ];

  for (const q of queries) {
    try {
      await sequelize.query(q);
      console.log("[DB] ensured:", q);
    } catch (err) {
      console.error("[DB] failed running:", q, err);
      // 记录错误但不退出——以尽量让服务启动（除非是关键错误）
    }
  }
}

// 启动流程：先确保列，再同步模型（以防添加新列），最后启动 express
(async () => {
  try {
    await ensureColumns();

    // 只做最小的 sync（避免复杂类型转换）。你可以改为 { alter: true } 在 dev 环境使用。
    await sequelize.sync();

    app.listen(config.PORT, () => {
      console.log("Backend running on port", config.PORT);
    });
  } catch (err) {
    console.error("startup error:", err);
    process.exit(1);
  }
})();
