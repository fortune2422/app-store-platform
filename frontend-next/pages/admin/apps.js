// frontend-next/pages/admin/apps.js
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default function AppsList() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${API_BASE}/list`);
        setApps(res.data.apps || []);
      } catch (err) {
        console.error(err);
        setLog("加载失败：" + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function makeLandingUrl(app) {
    // 如果单独配了域名，就用它；否则用默认站点 + /app/:id
    if (app.landingDomain) return app.landingDomain;
    if (SITE_URL) return `${SITE_URL}/app/${app.id}`;
    return `/app/${app.id}`;
  }

  async function copyToClipboard(text) {
    try {
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setLog("已复制链接：" + text);
      } else {
        setLog("当前浏览器不支持一键复制，请手动复制：" + text);
      }
    } catch (e) {
      setLog("复制失败：" + e.message);
    }
  }

  return (
    <div className="container">
      <h1>应用管理列表</h1>
      <p>
        在这里可以看到所有已创建的应用，每条都有自己的落地页链接和 APK
        状态。
      </p>

      {loading ? (
        <p>加载中...</p>
      ) : (
        <table className="apps-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>图标</th>
              <th>名称 / 编号</th>
              <th>落地页域名 / 链接</th>
              <th>APK</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => {
              const landingUrl = makeLandingUrl(app);
              return (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>
                    {app.iconUrl && (
                      <img
                        src={app.iconUrl}
                        alt={app.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          objectFit: "cover"
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {app.code || ""}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>
                      {app.landingDomain || "(未单独配置域名)"}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {landingUrl}
                    </div>
                  </td>
                  <td>
                    {app.apkUrl ? (
                      <span style={{ color: "green", fontSize: 13 }}>
                        已上传
                      </span>
                    ) : (
                      <span style={{ color: "red", fontSize: 13 }}>
                        未上传
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: 12, color: "#64748b" }}>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleString()
                      : ""}
                  </td>
                  <td>
                    <a
                      className="btn"
                      href={landingUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginRight: 8 }}
                    >
                      打开落地页
                    </a>
                    <button
                      className="btn"
                      onClick={() => copyToClipboard(landingUrl)}
                    >
                      复制链接
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <section style={{ marginTop: 24 }}>
        <h2>日志</h2>
        <pre>{log}</pre>
      </section>
    </div>
  );
}
