// frontend-next/pages/api/apps/[id].js
import { initDb } from "../../../lib/initDb";

export default async function handler(req, res) {
  const { App } = await initDb();
  const {
    query: { id },
    method
  } = req;

  if (method === "GET") {
    try {
      const app = await App.findByPk(id);
      if (!app) return res.status(404).json({ error: "app not found" });
      res.status(200).json({ app });
    } catch (e) {
      console.error("get app error:", e);
      res.status(500).json({ error: e.message || "get failed" });
    }
  } else if (method === "PUT") {
    try {
      const app = await App.findByPk(id);
      if (!app) return res.status(404).json({ error: "app not found" });

      await app.update(req.body);
      res.status(200).json({ app });
    } catch (e) {
      console.error("update app error:", e);
      res.status(500).json({ error: e.message || "update failed" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end("Method Not Allowed");
  }
}
