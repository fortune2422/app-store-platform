// frontend-next/pages/app/[id].js
import Head from "next/head";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function PlayStylePage({ app }) {
  if (!app) {
    return (
      <div className="play-page play-page-empty">
        <p>App 不存在，可能已经被下架。</p>
      </div>
    );
  }

  const screenshots = app.screenshots || [];
  const rating = app.rating || 4.8;
  const reviewsCount = app.reviewsCount || 29000;
  const downloadsLabel = app.downloadsLabel || "2M+";
  const sizeLabel = app.sizeLabel || "25 MB";
  const updatedAtLabel = app.updatedAtLabel || "12/03/2025";
  const developerName = app.developerName || "george";
  const tags = (app.tags || "slot,casino,games")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const title = app.name || "App";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={app.description?.slice(0, 150)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="play-page">
        {/* 顶部 App 信息 */}
        <header className="play-header">
          <div className="play-app-main">
            <div className="play-app-icon-wrap">
              {app.iconUrl ? (
                <img
                  src={app.iconUrl}
                  alt={title}
                  className="play-app-icon"
                />
              ) : (
                <div className="play-app-icon placeholder" />
              )}
            </div>
            <div className="play-app-text">
              <h1 className="play-app-title">{title}</h1>
              <div className="play-app-dev">{developerName}</div>
              <div className="play-app-meta-small">In-app purchases</div>
            </div>
          </div>

          <div className="play-app-stats">
            <div className="play-stat">
              <div className="play-stat-main">
                {rating.toFixed(1)}{" "}
                <span className="play-star">★</span>
              </div>
              <div className="play-stat-sub">
                {Math.round(reviewsCount / 1000)}k&nbsp;reviews
              </div>
            </div>
            <div className="play-stat">
              <div className="play-stat-main">{downloadsLabel}</div>
              <div className="play-stat-sub">Downloads</div>
            </div>
            <div className="play-stat">
              <div className="play-badge">E</div>
              <div className="play-stat-sub">Rated for 18+</div>
            </div>
          </div>
        </header>

        {/* Install 按钮 */}
        <section className="play-install-section">
          <button
            className="play-install-btn"
            onClick={() => {
              if (app.apkUrl) {
                window.location.href = app.apkUrl;
              }
            }}
          >
            Install
          </button>
          <div className="play-install-actions">
            <button className="play-link-btn">share</button>
            <button className="play-link-btn">Add to wishlist</button>
          </div>
          <div className="play-availability">
            This app is available for your device
          </div>
        </section>

        {/* 截图区域 */}
        {screenshots.length > 0 && (
          <section className="play-screenshots">
            {screenshots.map((src, idx) => (
              <div key={idx} className="play-shot-wrap">
                <img src={src} alt={`screenshot-${idx}`} />
              </div>
            ))}
          </section>
        )}

        {/* About this app */}
        <section className="play-section">
          <h2 className="play-section-title">About this app</h2>
          <p className="play-description">{app.description}</p>

          <div className="play-updated">
            <div className="play-updated-label">Updated on</div>
            <div className="play-updated-date">{updatedAtLabel}</div>
          </div>

          {tags.length > 0 && (
            <div className="play-tags">
              {tags.map((tag, idx) => (
                <span key={idx} className="play-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Data safety（先做成固定文案） */}
        <section className="play-section">
          <h2 className="play-section-title">Data safety</h2>
          <p className="play-text-small">
            Safety starts with understanding how developers collect and share
            your data. Data privacy and security practices may vary based on
            your use, region and age. The developer provided this information
            and may update it over time.
          </p>

          <div className="play-safety-card">
            <div className="play-safety-row">
              <span className="play-safety-icon">🔒</span>
              <div>
                <div className="play-safety-main">
                  No data shared with third parties
                </div>
                <div className="play-text-small">
                  Learn more about how developers declare sharing
                </div>
              </div>
            </div>
            <div className="play-divider" />
            <div className="play-safety-row">
              <span className="play-safety-icon">📥</span>
              <div>
                <div className="play-safety-main">
                  Data is encrypted in transit
                </div>
                <div className="play-text-small">
                  Data can’t be read while it’s being sent
                </div>
              </div>
            </div>
            <div className="play-divider" />
            <div className="play-safety-row">
              <span className="play-safety-icon">🗑️</span>
              <div>
                <div className="play-safety-main">
                  You can request that data be deleted
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ratings & reviews（这里先用示例数据，视觉效果为主） */}
        <section className="play-section">
          <h2 className="play-section-title">Ratings and reviews</h2>
          <div className="play-ratings-layout">
            <div className="play-rating-left">
              <div className="play-rating-big">
                {rating.toFixed(1)}
              </div>
              <div className="play-rating-stars">
                {"★★★★★"}
              </div>
              <div className="play-text-small">
                {Math.round(reviewsCount / 1000)}k reviews
              </div>
            </div>
            <div className="play-rating-bars">
              {[5, 4, 3, 2, 1].map((star, idx) => (
                <div key={star} className="play-rating-row">
                  <span className="play-rating-star-label">{star}</span>
                  <div className="play-rating-bar">
                    <div
                      className="play-rating-bar-fill"
                      style={{ width: `${80 - idx * 15}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="play-review">
            <div className="play-review-header">
              <div className="play-avatar">M</div>
              <div>
                <div className="play-review-name">micheles</div>
                <div className="play-text-small">03/17/2025, 10:34 AM</div>
              </div>
            </div>
            <div className="play-review-stars">★★★★★</div>
            <p className="play-review-text">this app real pay</p>
          </div>

          <div className="play-review">
            <div className="play-review-header">
              <div className="play-avatar">J</div>
              <div>
                <div className="play-review-name">jessline</div>
                <div className="play-text-small">03/15/2025, 09:34 AM</div>
              </div>
            </div>
            <div className="play-review-stars">★★★★★</div>
            <p className="play-review-text">i win money with this app</p>
          </div>
        </section>
      </div>
    </>
  );
}

// 服务端渲染：根据 id 读取后端 App 数据
export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${API_BASE}/${params.id}`);
    if (!res.ok) {
      return { props: { app: null } };
    }
    const data = await res.json();
    return { props: { app: data.app || null } };
  } catch (e) {
    console.error(e);
    return { props: { app: null } };
  }
}
