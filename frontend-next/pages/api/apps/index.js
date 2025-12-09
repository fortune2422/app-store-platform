// frontend-next/pages/api/apps/index.js
import { initDb } from "../../../lib/initDb";

export default async function handler(req, res) {
  const { App } = await initDb();

  if (req.method === "GET") {
    // 列表
    try {
      const apps = await App.findAll({
        order: [["id", "DESC"]]
      });
      res.status(200).json({ apps });
    } catch (e) {
      console.error("list apps error:", e);
      res.status(500).json({ error: e.message || "list failed" });
    }
  } else if (req.method === "POST") {
    // 创建
    try {
      const app = await App.create(req.body);
      res.status(200).json({ app });
    } catch (e) {
      console.error("create app error:", e);
      res.status(500).json({ error: e.message || "create failed" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
