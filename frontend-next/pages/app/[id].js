
import Head from "next/head";
import axios from "axios";

export default function AppPage({ app }) {
  if (!app) return <div>App not found</div>;

  return (
    <>
      <Head>
        <title>{app.name} 下载</title>
        <meta name="description" content={app.description} />
      </Head>
      <div className="container">
        <div className="hero">
          {app.iconUrl && <img src={app.iconUrl} className="icon" />}
          <div>
            <h1>{app.name}</h1>
            <a className="btn" href={app.apkUrl}>下载 APK</a>
          </div>
        </div>
        <p>{app.description}</p>
        <div className="shots">
          {app.screenshots?.map((s, i) => (
            <img key={i} src={s} />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const res = await axios.get(
    `${process.env.API_BASE_URL}/${params.id}`
  );
  return { props: { app: res.data.app } };
}
