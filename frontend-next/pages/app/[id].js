// frontend-next/pages/app/[id].js
import Head from "next/head";

// 直接用 Next 自己的 API
const APPS_API = "/api/apps";

export default function AppLandingPage({ app }) {
  if (!app) {
    return (
      <>
        <Head>
          <title>App Not Found</title>
        </Head>
        <div className="play-page">
          <div className="play-main">
            <h1>App 不存在</h1>
            <p>这个链接可能已经失效，或者应用已被删除。</p>
          </div>
        </div>
      </>
    );
  }

  const screenshots = app.screenshots || [];
  const hasApk = !!app.apkUrl;

  return (
    <>
      <Head>
        <title>{app.name || "App"} - Download</title>
        <meta
          name="description"
          content={app.description?.slice(0, 150) || "Download Android app"}
        />
      </Head>

      <div className="play-page">
        {/* 顶部区域：图标 + 名称 + 安装按钮 */}
        <div className="play-main card">
          <div className="play-header">
            <div className="play-icon-wrap">
              {app.iconUrl ? (
                <img
                  src={app.iconUrl}
                  alt={app.name}
                  className="play-icon"
                />
              ) : (
                <div className="play-icon placeholder" />
              )}
            </div>

            <div className="play-header-info">
              <h1 className="play-title">{app.name}</h1>
              <div className="play-subtitle">
                <span className="dev-name">
                  {app.developerName || "Unknown developer"}
                </span>
              </div>

              <div className="play-meta-row">
                <div className="play-meta-item">
                  <div className="play-meta-main">
                    <span className="play-meta-value">
                      {app.rating ?? "4.8"}
                    </span>
                    <span className="play-meta-icon">★</span>
                  </div>
                  <div className="play-meta-label">
                    {app.reviewsCount
                      ? `${app.reviewsCount.toLocaleString()} reviews`
                      : "Rating"}
                  </div>
                </div>

                <div className="play-meta-dot" />

                <div className="play-meta-item">
                  <div className="play-meta-main">
                    <span className="play-meta-value">
                      {app.downloadsLabel || "1M+"}
                    </span>
                  </div>
                  <div className="play-meta-label">Downloads</div>
                </div>

                <div className="play-meta-dot" />

                <div className="play-meta-item">
                  <div className="play-meta-main">
                    <span className="play-meta-value">
                      {app.sizeLabel || "25 MB"}
                    </span>
                  </div>
                  <div className="play-meta-label">Size</div>
                </div>
              </div>
            </div>

            <div className="play-action">
              {hasApk ? (
                <a
                  href={app.apkUrl}
                  className="play-install-btn"
                >
                  Install
                </a>
              ) : (
                <button className="play-install-btn disabled" disabled>
                  APK 未上传
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 截图区域 */}
        {screenshots.length > 0 && (
          <div className="play-main card" style={{ marginTop: 16 }}>
            <h2 className="section-title">Screenshots</h2>
            <div className="play-screenshots">
              {screenshots.map((url, idx) => (
                <div key={idx} className="play-screenshot-item">
                  <img src={url} alt={`screenshot-${idx}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About this app */}
        <div className="play-main card" style={{ marginTop: 16 }}>
          <h2 className="section-title">About this app</h2>
          {app.updatedAtLabel && (
            <div className="play-updated">
              Updated on {app.updatedAtLabel}
            </div>
          )}
          <p className="play-description">
            {app.description || "No description provided."}
          </p>
        </div>
      </div>
    </>
  );
}

// SSR：在服务端调用自己的 /api/apps/:id
export async function getServerSideProps({ params, req }) {
  const host = req?.headers?.host;
  const proto = req?.headers["x-forwarded-proto"] || "https";
  const base = `${proto}://${host}`;

  try {
    const res = await fetch(`${base}${APPS_API}/${params.id}`);
    if (!res.ok) {
      return { props: { app: null } };
    }
    const data = await res.json();
    return { props: { app: data.app || null } };
  } catch (e) {
    console.error("getServerSideProps error:", e);
    return { props: { app: null } };
  }
}
