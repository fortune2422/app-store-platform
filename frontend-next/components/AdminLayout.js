// frontend-next/components/AdminLayout.js
import Link from "next/link";

export default function AdminLayout({ active, children }) {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-logo">App 后台</span>
          <nav className="admin-nav">
            <Link
              href="/admin"
              className={
                active === "create" ? "admin-nav-link active" : "admin-nav-link"
              }
            >
              新增落地页
            </Link>
            <Link
              href="/admin/apps"
              className={
                active === "list" ? "admin-nav-link active" : "admin-nav-link"
              }
            >
              应用管理列表
            </Link>
          </nav>
        </div>
      </header>

      <main className="admin-main">{children}</main>
    </div>
  );
}
