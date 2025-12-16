// frontend-next/pages/admin/domains.js
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function DomainsPage() {
  const [domainInput, setDomainInput] = useState("");
  const [owner, setOwner] = useState("");
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastMsg, setLastMsg] = useState("");

  useEffect(() => {
    loadDomains();
  }, []);

  async function loadDomains() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/domains`);
      setDomains(res.data.domains || []);
    } catch (e) {
      console.error(e);
      setLastMsg("加载域名失败：" + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  }

  async function addDomain() {
    if (!domainInput) return setLastMsg("请输入域名");
    try {
      const res = await axios.post(`${API_BASE}/domains`, { domain: domainInput.trim(), owner: owner.trim() || null });
      setLastMsg("域名已添加，查看下方说明并完成 DNS 解析后点击验证。");
      setDomains((d) => [res.data.domain, ...d]);
    } catch (e) {
      console.error(e);
      setLastMsg("添加失败：" + (e.response?.data?.error || e.message));
    }
  }

  async function verifyDomain(id) {
    try {
      setLastMsg("正在检查 DNS，请稍候...");
      const res = await axios.post(`${API_BASE}/domains/${id}/verify`);
      if (res.data.ok) {
        setLastMsg("验证通过！域名已标为 verified。");
      } else {
        setLastMsg("验证未通过：" + JSON.stringify(res.data.details));
      }
      await loadDomains();
    } catch (e) {
      console.error(e);
      setLastMsg("验证出错：" + (e.response?.data?.error || e.message));
    }
  }

  async function deleteDomain(id) {
    if (!confirm("确定删除这个域名吗？")) return;
    try {
      await axios.delete(`${API_BASE}/domains/${id}`);
      setLastMsg("已删除");
      setDomains((d) => d.filter(x => x.id !== id));
    } catch (e) {
      console.error(e);
      setLastMsg("删除失败：" + (e.response?.data?.error || e.message));
    }
  }

  return (
    <AdminLayout active="domains">
      <div className="container">
        <h1>自定义域名管理</h1>

        <section style={{ marginTop: 16 }}>
          <h2>新增域名</h2>
          <input placeholder="example.com 或 sub.example.com" value={domainInput} onChange={(e) => setDomainInput(e.target.value)} />
          <br />
          <input placeholder="所属（可选，如 team 名）" value={owner} onChange={(e) => setOwner(e.target.value)} />
          <br />
          <button className="btn-primary" onClick={addDomain}>添加域名</button>
          <p className="muted">添加后系统会生成一个验证 token，请在 DNS 管理面板添加 TXT 记录，然后点击“检查验证”。</p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>已添加域名</h2>
          {loading ? <p>加载中...</p> : (
            <table className="simple-table">
              <thead><tr><th>域名</th><th>状态</th><th>token / 说明</th><th>操作</th></tr></thead>
              <tbody>
                {domains.map(d => (
                  <tr key={d.id}>
                    <td>{d.domain}</td>
                    <td>{d.status}</td>
                    <td>
                      <div><strong>TXT 主机：</strong>_appstore-verification.{d.domain}</div>
                      <div><strong>TXT 值：</strong>{d.token}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>添加 TXT 后点击“检查验证”</div>
                    </td>
                    <td>
                      <button className="btn" onClick={() => verifyDomain(d.id)}>检查验证</button>
                      <button className="btn danger" onClick={() => deleteDomain(d.id)} style={{ marginLeft: 8 }}>删除</button>
                    </td>
                  </tr>
                ))}
                {domains.length === 0 && <tr><td colSpan="4">还没有域名</td></tr>}
              </tbody>
            </table>
          )}
        </section>

        <section style={{ marginTop: 18 }}>
          <h2>帮助 / 说明</h2>
          <ol>
            <li>添加域名后，系统会生成一个 <code>token</code>。请在你的域名 DNS 管理里添加一条 TXT 记录：</li>
            <pre>主机名（Host / Name）：_appstore-verification.example.com
值（Value）：{`<token>`}</pre>
            <li>等待 DNS 生效（通常几分钟到数小时），然后在列表中点击“检查验证”。</li>
            <li>验证通过后，域名状态变为 <code>verified</code>，创建应用时即可在“落地页域名”下拉里选择它。</li>
          </ol>
        </section>

        <section style={{ marginTop: 18 }}>
          <h2>日志 / 提示</h2>
          <pre style={{ background: "#f7f7f8", padding: 8 }}>{lastMsg}</pre>
        </section>
      </div>

      <style jsx>{`
        .container { padding: 20px; }
        input { padding: 8px; border:1px solid #e6e9ef; border-radius:6px; width:100%; max-width:480px; margin-bottom:8px; }
        .btn-primary { background:#2563eb; color:#fff; padding:8px 12px; border-radius:6px; border:0; }
        .muted { color:#64748b; font-size:13px; }
        .simple-table { width:100%; border-collapse: collapse; margin-top: 8px; }
        .simple-table th, .simple-table td { border:1px solid #eee; padding:8px; text-align:left; vertical-align:top; }
        .btn { padding:6px 8px; border-radius:6px; border:1px solid #ccd; background:#fff; cursor:pointer; }
        .btn.danger { border-color:#fca5a5; color:#b91c1c; }
        pre { white-space: pre-wrap; word-break:break-word; }
      `}</style>
    </AdminLayout>
  );
}
