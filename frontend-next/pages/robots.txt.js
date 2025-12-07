
export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain");
  res.write("User-agent: *\nAllow: /");
  res.end();
  return { props: {} };
}
export default function Robots() {}
