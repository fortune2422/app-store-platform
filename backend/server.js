const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const config = require("./config");
// server.js (片段)
const required = ["R2_BUCKET", "R2_ACCESS_KEY", "R2_SECRET_KEY", "DATABASE_URL"];
required.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`Warning: env ${k} is not set`);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/apps", require("./routes/apps"));

// server.js - 在文件顶部已有 const { sequelize } = require("./models"); 保持不动
async function ensureColumns() {
  // 注意：使用双引号包列名以防大小写差别
  const queries = [
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "apkKey" TEXT;`,
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "iconKey" TEXT;`,
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "desktopIconKey" TEXT;`,
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "bannerKey" TEXT;`,
    // 使用 JSONB 存数组更灵活（也可以用 TEXT[]）
    `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "screenshotKeys" JSONB DEFAULT '[]'::jsonb;`,
    // 如果你还想确保 apkUrl/iconUrl 等存在（通常已有），可取消注释：
    // `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "apkUrl" TEXT;`,
    // `ALTER TABLE "Apps" ADD COLUMN IF NOT EXISTS "iconUrl" TEXT;`
  ];

  for (const q of queries) {
    try {
      await sequelize.query(q);
      console.log("[DB] ensured:", q);
    } catch (err) {
      console.error("[DB] failed running:", q, err);
      // 不要 process.exit，这里只记录，下一步仍会尝试 sync
    }
  }
}

(async () => {
  try {
    await ensureColumns();

    // 然后再同步模型（可选 alter）
    await sequelize.sync({ alter: true });
    const app = require("./app"); // or continue to start express if you define app in this file
    const config = require("./config");
    app.listen(config.PORT, () => console.log("Backend running on port", config.PORT));
  } catch (err) {
    console.error("startup error:", err);
    process.exit(1);
  }
})();


