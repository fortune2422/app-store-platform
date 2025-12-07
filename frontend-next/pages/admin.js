// frontend-next/pages/admin.js
import { useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function Admin() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    packageName: "",
    version: "",
    description: "",
    developerName: "",
    rating: "4.8",
    reviewsCount: "100",
    downloadsLabel: "2M+",
    sizeLabel: "25 MB",
    updatedAtLabel: "",
    landingDomain: "",
    note: ""
  });
  const [appId, setAppId] = useState("");
  const [fileType, setFileType] = useState("apk");
  const [file, setFile] = useState(null);
  const [log, setLog] = useState("");

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function createApp() {
    try {
      const payload = {
        ...form,
        rating: form.rating ? parseFloat(form.rating) : null,
        reviewsCount: form.reviewsCount ? parseInt(form.reviewsCount, 10) : null
      };
      const res = await axios.post(`${API_BASE}/create`, payload);
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
      fd.append("type", fileType); // apk | icon | screenshot | desktopIcon | banner

      const res = await axios.post(`${API_BASE}/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setLog(`✅ 上传成功：${res.data.url}`);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setLog(
          "❌ 上传失败（有响应）：" +
            err.response.status +
            " " +
            JSON.stringify(err.response.data)
        );
      } else {
        setLog("❌ 上传失败（网络层）：" + err.message);
      }
    }
  }

  return (
    <div className="container">
      <h1>后台管理 / Admin</h1>

      <section style={{ marginTop: 24 }}>
        <h2>1. 基础信息</h2>
        <input
          placeholder="显示名称（如：GO606-33）"
          value={form.name}
          onChange={onChange("name")}
        />
        <br />
        <input
          placeholder="内部代码（可选，如：GO606-33）"
          value={form.code}
          onChange={onChange("code")}
        />
        <br />
        <input
          placeholder="包名（可选）"
          value={form.packageName}
          onChange={onChange("packageName")}
        />
        <br />
        <input
          placeholder="版本号（如：1.0.0）"
          value={form.version}
          onChange={onChange("version")}
        />
        <br />
        <textarea
          placeholder="应用描述（About this app）"
          value={form.description}
          onChange={onChange("description")}
        />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>2. 商店信息</h2>
        <input
          placeholder="开发者名称（如：george）"
          value={form.developerName}
          onChange={onChange("developerName")}
        />
        <br />
        <input
          placeholder="评分（如：4.8）"
          value={form.rating}
          onChange={onChange("rating")}
        />
        <br />
        <input
          placeholder="评价数量（如：29）"
          value={form.reviewsCount}
          onChange={onChange("reviewsCount")}
        />
        <br />
        <input
          placeholder="下载量展示（如：2M+）"
          value={form.downloadsLabel}
          onChange={onChange("downloadsLabel")}
        />
        <br />
        <input
          placeholder="应用大小（如：25 MB）"
          value={form.sizeLabel}
          onChange={onChange("sizeLabel")}
        />
        <br />
        <input
          placeholder="更新时间展示（如：Dec 7, 2025）"
          value={form.updatedAtLabel}
          onChange={onChange("updatedAtLabel")}
        />
        <br />
        <button className="btn" onClick={createApp}>
          创建 / 更新 App
        </button>
        {appId && <p>当前 App ID：{appId}</p>}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>3. 上传资源（icon / 桌面图标 / 截图 / APK / Banner）</h2>
        <p>请确保已经有 App ID：{appId || "（还没有）"}</p>

        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value="apk">APK</option>
          <option value="icon">安装页图标</option>
          <option value="desktopIcon">桌面图标</option>
          <option value="banner">顶部 Banner</option>
          <option value="screenshot">Screenshot 截图</option>
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
