// frontend-next/pages/app/[id].js
import Head from "next/head";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default function AppLanding({ app }) {
  if (!app) {
    return (
      <div className="gp-root">
        <div className="gp-card">
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>App not found</h1>
          <p>这个应用不存在，或者已经被删除。</p>
        </div>
        <style jsx>{`
          .gp-root {
            min-height: 100vh;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            background: #f1f3f4;
            padding: 16px;
          }
          .gp-card {
            width: 100%;
            max-width: 480px;
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          }
        `}</style>
      </div>
    );
  }

  const {
    name,
    developerName,
    rating,
    reviewsCount,
    downloadsLabel,
    sizeLabel,
    updatedAtLabel,
    description,
    iconUrl,
    screenshots = [],
    apkUrl,
  } = app;

  const displayRating = rating != null ? rating.toFixed(1) : "4.8";
  const displayReviews =
    reviewsCount != null ? `${reviewsCount} reviews` : "100 reviews";
  const displayDownloads = downloadsLabel || "2M+";
  const displaySize = sizeLabel || "25 MB";
  const displayUpdated = updatedAtLabel || "";

  const canDownload = Boolean(apkUrl);

  const handleInstall = () => {
    if (!canDownload) return;
    if (typeof window !== "undefined") {
      window.location.href = apkUrl;
    }
  };

  return (
    <>
      <Head>
        <title>{name} - Apps on Google Play</title>
        <meta
          name="description"
          content={description || `${name} on Google Play style landing page`}
        />
        {SITE_URL && (
          <link rel="canonical" href={`${SITE_URL}/app/${app.id}`} />
        )}
      </Head>

      <div className="gp-root">
        <div className="gp-wrapper">
          {/* 顶部 App 信息块 */}
          <div className="gp-card gp-header">
            <div className="gp-header-main">
              <div className="gp-icon-wrap">
                {iconUrl ? (
                  <img src={iconUrl} alt={name} className="gp-icon" />
                ) : (
                  <div className="gp-icon gp-icon-placeholder" />
                )}
              </div>
              <div className="gp-title-area">
                <h1 className="gp-title">{name}</h1>
                <div className="gp-dev">{developerName || "george"}</div>
                <div className="gp-meta-row">
                  <div className="gp-meta-item">
                    <span className="gp-rating-number">{displayRating}</span>
                    <span className="gp-star">★</span>
                  </div>
                  <span className="gp-dot">·</span>
                  <div className="gp-meta-item">{displayReviews}</div>
                  <span className="gp-dot">·</span>
                  <div className="gp-meta-item">{displayDownloads} Downloads</div>
                  <span className="gp-dot">·</span>
                  <div className="gp-meta-item">{displaySize}</div>
                </div>
              </div>
            </div>

            <button
              className={`gp-install-btn ${
                canDownload ? "gp-install-btn-active" : "gp-install-btn-disabled"
              }`}
              onClick={handleInstall}
            >
              {canDownload ? "Install" : "APK 未上传"}
            </button>
          </div>

          {/* 截图区域 */}
          {screenshots && screenshots.length > 0 && (
            <div className="gp-card gp-screens-card">
              <div className="gp-screens-scroller">
                {screenshots.map((url, idx) => (
                  <div className="gp-screen-item" key={idx}>
                    <img src={url} alt={`${name} screenshot ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About this app */}
          <div className="gp-card">
            <h2 className="gp-section-title">About this app</h2>
            {displayUpdated && (
              <div className="gp-updated">Updated on {displayUpdated}</div>
            )}
            <p className="gp-desc">
              {description && description.trim()
                ? description
                : "No description provided."}
            </p>
          </div>

          {/* Data safety（静态文案占位） */}
          <div className="gp-card">
            <h2 className="gp-section-title">Data safety</h2>
            <p className="gp-muted">
              Safety starts with understanding how developers collect and share
              your data. Data privacy and security practices may vary based on
              your use, region, and age. The developer provided this information
              and may update it over time.
            </p>
            <ul className="gp-list">
              <li>No data shared with third parties</li>
              <li>Data is encrypted in transit</li>
              <li>You can request that data be deleted</li>
            </ul>
          </div>

          {/* Ratings & reviews（简单版） */}
          <div className="gp-card">
            <h2 className="gp-section-title">Ratings and reviews</h2>
            <div className="gp-rating-block">
              <div className="gp-rating-main">{displayRating}</div>
              <div className="gp-rating-star-row">
                <span>★★★★★</span>
              </div>
              <div className="gp-muted-small">{displayReviews}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gp-root {
          min-height: 100vh;
          background: #f1f3f4;
          display: flex;
          justify-content: center;
          padding: 16px 8px 32px;
        }

        .gp-wrapper {
          width: 100%;
          max-width: 480px;
        }

        .gp-card {
          background: #fff;
          border-radius: 16px;
          padding: 16px 16px 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          margin-bottom: 12px;
        }

        .gp-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .gp-header-main {
          display: flex;
          gap: 16px;
        }

        .gp-icon-wrap {
          flex-shrink: 0;
        }

        .gp-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          object-fit: cover;
        }

        .gp-icon-placeholder {
          background: #e0e0e0;
        }

        .gp-title-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .gp-title {
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 4px;
          color: #202124;
        }

        .gp-dev {
          font-size: 14px;
          color: #1a73e8;
          margin-bottom: 6px;
        }

        .gp-meta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #5f6368;
        }

        .gp-meta-item {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .gp-rating-number {
          font-weight: 600;
        }

        .gp-star {
          color: #fbbc04;
          font-size: 12px;
          margin-left: 1px;
        }

        .gp-dot {
          color: #9aa0a6;
          margin: 0 2px;
        }

        .gp-install-btn {
          border: none;
          border-radius: 999px;
          height: 48px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          margin-top: 4px;
          transition: filter 0.15s ease, transform 0.05s ease;
        }

        .gp-install-btn-active {
          background: #1a73e8; /* Google Play 绿色可换成 #01875f，如果你更喜欢 */
          color: #fff;
        }

        .gp-install-btn-active:hover {
          filter: brightness(1.05);
        }

        .gp-install-btn-active:active {
          transform: scale(0.98);
        }

        .gp-install-btn-disabled {
          background: #dadce0;
          color: #5f6368;
          cursor: default;
        }

        .gp-screens-card {
          padding: 12px 0 12px 16px;
        }

        .gp-screens-scroller {
          display: flex;
          overflow-x: auto;
          gap: 8px;
          padding-right: 8px;
        }

        .gp-screen-item {
          flex: 0 0 140px;
          height: 250px;
          border-radius: 12px;
          overflow: hidden;
          background: #e0e0e0;
        }

        .gp-screen-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gp-section-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px;
          color: #202124;
        }

        .gp-updated {
          font-size: 12px;
          color: #5f6368;
          margin-bottom: 8px;
        }

        .gp-desc {
          font-size: 14px;
          color: #202124;
          white-space: pre-line;
        }

        .gp-muted {
          font-size: 13px;
          color: #5f6368;
          margin-bottom: 8px;
        }

        .gp-list {
          padding-left: 18px;
          margin: 0;
          font-size: 13px;
          color: #202124;
        }

        .gp-list li + li {
          margin-top: 4px;
        }

        .gp-rating-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .gp-rating-main {
          font-size: 32px;
          font-weight: 700;
          color: #202124;
        }

        .gp-rating-star-row {
          font-size: 14px;
          color: #fbbc04;
        }

        .gp-muted-small {
          font-size: 12px;
          color: #5f6368;
        }

        @media (min-width: 768px) {
          .gp-wrapper {
            max-width: 600px;
          }
        }
      `}</style>
    </>
  );
}

// SSR：从自己的 /api/apps/:id 读取数据
export async function getServerSideProps({ params, req }) {
  const { id } = params;

  // 推断当前站点地址（本地 / 线上都兼容）
  const baseUrl =
    SITE_URL ||
    `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}`;

  try {
    const res = await fetch(`${baseUrl}/api/apps/${id}`);
    if (!res.ok) {
      return { props: { app: null } };
    }
    const data = await res.json();
    return { props: { app: data.app || null } };
  } catch (e) {
    console.error("SSR load app error", e);
    return { props: { app: null } };
  }
}
