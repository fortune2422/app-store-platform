// frontend-next/pages/admin.js
import { useState } from "react";
import axios from "axios";

// 后端 API 地址，从环境变量里拿
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function Admin() {
  const [form, setForm] = useState({
    name: "",
    packageName: "",
    version: "",
    description: ""
  });
  const [appId, setAppId] = useState("");
  const [fileType, setFileType] = useState("apk");
  const [file, setFile] = useState(null);
  const [log, setLog] = useState("");

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function createApp() {
    try {
      const res = await axios.post(`${API_BASE}/create`, form);
      setAppId(res.data.app.id);
      setLog(`✅ 创建成功，App ID = ${res.data.app.id}`);
    } catch (err) {
      console.error(err);
      setLog("❌ 创建失败：" + (err.response?.data?.error || err.message));
    }
  }

  async function uploadFile() {
    if (!appId) return setLog("请先创建 App，拿到 appId");
    if (!file) return setLog("请先选择文件");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("appId", appId);
      fd.append("type", fileType); // apk | icon | screenshot

      const res = await axios.post(`${API_BASE}/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setLog(`✅ 上传成功：${res.data.url}`);
    } catch (err) {
      console.error(err);
      setLog("❌ 上传失败：" + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div className="container">
      <h1>后台管理 / Admin</h1>

      <section style={{ marginTop: 24 }}>
        <h2>1. 创建应用</h2>
        <input
          placeholder="App 名称"
          value={form.name}
          onChange={onChange("name")}
        />
        <br />
        <input
          placeholder="包名（可选）"
          value={form.packageName}
          onChange={onChange("packageName")}
        />
        <br />
        <input
          placeholder="版本号（可选）"
          value={form.version}
          onChange={onChange("version")}
        />
        <br />
        <textarea
          placeholder="描述"
          value={form.description}
          onChange={onChange("description")}
        />
        <br />
        <button className="btn" onClick={createApp}>
          创建 App
        </button>
        {appId && <p>当前 App ID：{appId}</p>}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>2. 上传文件（icon / 截图 / APK）</h2>
        <p>请确保已经有 App ID：{appId || "（还没有）"}</p>

        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value="apk">APK</option>
          <option value="icon">Icon</option>
          <option value="screenshot">Screenshot</option>
        </select>
        <br />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <button className="btn" onClick={uploadFile}>
          上传文件
        </button>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>日志</h2>
        <pre>{log}</pre>
      </section>
    </div>
  );
}
