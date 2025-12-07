// frontend-next/pages/app/[id].js
import Head from "next/head";
import axios from "axios";

export default function AppPage({ app }) {
  if (!app) return <div className="container">App not found</div>;

  return (
    <>
      <Head>
        <title>{app.name} - Download</title>
        <meta name="description" content={app.description || ""} />
      </Head>
      <div className="store-page">
        <div className="store-main">
          {/* 顶部区域 */}
          <div className="store-header">
            <div className="store-header-left">
              <img
                src={app.iconUrl || app.desktopIconUrl}
                className="store-icon"
                alt={app.name}
              />
              <div>
                <h1 className="store-title">{app.name}</h1>
                <div className="store-dev">{app.developerName}</div>
              </div>
            </div>
            <div className="store-header-right">
              {app.apkUrl ? (
                <a className="btn primary" href={app.apkUrl}>
                  Install
                </a>
              ) : (
                <button className="btn" disabled>
                  APK 未上传
                </button>
              )}
            </div>
          </div>

          {/* 评分 & 下载信息 */}
          <div className="store-meta-row">
            <div className="store-meta-item">
              <div className="store-meta-main">
                {app.rating?.toFixed(1) || "4.8"}
              </div>
              <div className="store-meta-sub">
                {app.reviewsCount || 0} reviews
              </div>
            </div>
            <div className="store-meta-item">
              <div className="store-meta-main">
                {app.downloadsLabel || "1M+"}
              </div>
              <div className="store-meta-sub">Downloads</div>
            </div>
            <div className="store-meta-item">
              <div className="store-meta-main">
                {app.sizeLabel || "25 MB"}
              </div>
              <div className="store-meta-sub">Size</div>
            </div>
            <div className="store-meta-item">
              <div className="store-meta-main">
                {app.updatedAtLabel || ""}
              </div>
              <div className="store-meta-sub">Updated on</div>
            </div>
          </div>

          {/* 截图区域 */}
          <div className="store-shots">
            {app.screenshots?.map((s, i) => (
              <img key={i} src={s} alt={`screenshot-${i}`} />
            ))}
          </div>

          {/* About this app */}
          <div className="store-section">
            <h2>About this app</h2>
            <p>{app.description}</p>
          </div>
        </div>

        {/* 右侧大图标 / banner */}
        <div className="store-side">
          <div className="store-side-card">
            <img
              src={app.bannerUrl || app.desktopIconUrl || app.iconUrl}
              alt="banner"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "";
  const res = await axios.get(`${API_BASE}/${params.id}`);
  return { props: { app: res.data.app } };
}
