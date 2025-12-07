// frontend-next/pages/admin.js
import { useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

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
        reviewsCount: form.reviewsCount
          ? parseInt(form.reviewsCount, 10)
          : null
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
    <AdminLayout active="create">
      <div className="admin-page">
        <h1 className="admin-page-title">后台管理 / 新增落地页</h1>

        <div className="admin-grid">
          {/* 左侧：基础信息 + 商店信息 */}
          <div className="admin-column">
            <div className="card">
              <h2 className="section-title">1. 基础信息</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">显示名称</label>
                  <input
                    className="field-input"
                    placeholder="如：GO606-33"
                    value={form.name}
                    onChange={onChange("name")}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">内部代码（可选）</label>
                  <input
                    className="field-input"
                    placeholder="如：GO606-33"
                    value={form.code}
                    onChange={onChange("code")}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">包名（可选）</label>
                  <input
                    className="field-input"
                    placeholder="如：com.go606.app"
                    value={form.packageName}
                    onChange={onChange("packageName")}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">版本号</label>
                  <input
                    className="field-input"
                    placeholder="如：1.0.0"
                    value={form.version}
                    onChange={onChange("version")}
                  />
                </div>
                <div className="form-field form-field-full">
                  <label className="field-label">应用描述</label>
                  <textarea
                    className="field-textarea"
                    placeholder="About this app..."
                    value={form.description}
                    onChange={onChange("description")}
                  />
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <h2 className="section-title">2. 商店信息</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">开发者名称</label>
                  <input
                    className="field-input"
                    placeholder="如：george"
                    value={form.developerName}
                    onChange={onChange("developerName")}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">评分</label>
                  <input
                    className="field-input"
                    placeholder="如：4.8"
                    value={form.rating}
                    onChange={onChange("rating")}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">评价数量</label>
                  <input
                    className="field-input"
                    placeholder="如：28921"
                    value={form.reviewsCount}
                    onChange={onChange("reviewsCount")}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">下载量展示</label>
                  <input
                    className="field-input"
                    placeholder="如：2M+"
                    value={form.downloadsLabel}
                    onChange={onChange("downloadsLabel")}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">应用大小</label>
                  <input
                    className="field-input"
                    placeholder="如：25 MB"
                    value={form.sizeLabel}
                    onChange={onChange("sizeLabel")}
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">更新时间展示</label>
                  <input
                    className="field-input"
                    placeholder="如：Dec 7, 2025"
                    value={form.updatedAtLabel}
                    onChange={onChange("updatedAtLabel")}
                  />
                </div>
                <div className="form-field form-field-full">
                  <label className="field-label">落地页域名</label>
                  <input
                    className="field-input"
                    placeholder="如：go606-33.playxxx.xyz"
                    value={form.landingDomain}
                    onChange={onChange("landingDomain")}
                  />
                </div>
                <div className="form-field form-field-full">
                  <label className="field-label">备注（内部说明）</label>
                  <textarea
                    className="field-textarea"
                    placeholder="给自己看的备注，可选"
                    value={form.note}
                    onChange={onChange("note")}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={createApp}>
                  创建 / 更新 App
                </button>
                {appId && (
                  <span className="muted">
                    当前 App ID：<strong>{appId}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：上传资源 + 日志 */}
          <div className="admin-column">
            <div className="card">
              <h2 className="section-title">
                3. 上传资源（Icon / 桌面图标 / 截图 / APK / Banner）
              </h2>
              <p className="muted">
                请确保已经创建 App，当前 App ID：
                {appId ? <strong>{appId}</strong> : "（还没有）"}
              </p>

              <div className="form-field">
                <label className="field-label">资源类型</label>
                <select
                  className="field-input"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <option value="apk">APK</option>
                  <option value="icon">安装页图标</option>
                  <option value="desktopIcon">桌面图标</option>
                  <option value="banner">顶部 Banner</option>
                  <option value="screenshot">Screenshot 截图</option>
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">选择文件</label>
                <input
                  className="field-input"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={uploadFile}>
                  上传文件
                </button>
              </div>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <h2 className="section-title">日志</h2>
              <pre className="log-box">{log}</pre>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
