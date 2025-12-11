// frontend-next/pages/admin/domains.js
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

export default function DomainsPage() {
  const [list, setList] = useState([]);
  const [domainInput, setDomainInput] = useState("");
  const [log, setLog] = useState("");

  async function load() {
    try {
      const res = await axios.get("/api/domains");
      setList(res.data.domains || []);
    } catch (e) {
      setLog("加载失败：" + e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addDomain() {
    try {
      if (!domainInput) return setLog("请输入域名");
      await axios.post("/api/domains", { domain: domainInput });
      setDomainInput("");
      setLog("已添加，状态 pending，请解析并点击验证");
      await load();
    } catch (e) {
      setLog("添加失败：" + (e.response?.data?.error || e.message));
    }
  }

  async function verify(id) {
    try {
      setLog("验证中...");
      const res = await axios.post(`/api/domains/${id}/verify`);
      setLog(res.data.message || "done");
      await load();
    } catch (e) {
      setLog("验证请求失败：" + (e.response?.data?.error || e.message));
    }
  }

  return (
    <AdminLayout active="domains">
      <div className="container">
        <h1>自定义域管理</h1>
        <p>添加自定义域（用户需要在其 DNS 控制台把域 CNAME 指向 R2 target），添加后点击“验证”。</p>

        <div style={{ display: "flex", gap: 8 }}>
          <input value={domainInput} onChange={(e) => setDomainInput(e.target.value)} placeholder="例如 dl.example.com" />
          <button onClick={addDomain}>添加域名</button>
        </div>

        <table style={{ width: "100%", marginTop: 16 }}>
          <thead><tr><th>域名</th><th>状态</th><th>最后验证</th><th>信息</th><th>操作</th></tr></thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.id}>
                <td>{d.domain}</td>
                <td>{d.status}</td>
                <td>{d.lastCheckedAt ? new Date(d.lastCheckedAt).toLocaleString() : "-"}</td>
                <td style={{ maxWidth: 400 }}>{d.lastMessage}</td>
                <td>
                  <button onClick={() => verify(d.id)}>验证</button>
                  <button onClick={() => { if(confirm("删除?")) axios.delete(`/api/domains/${d.id}`).then(()=>load()) }}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <section style={{ marginTop: 24 }}>
          <h3>日志</h3>
          <pre>{log}</pre>
        </section>
      </div>
    </AdminLayout>
  );
}
