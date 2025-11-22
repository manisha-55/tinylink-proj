// export default function CodeStats({params}){return <div>Stats for {params.code}</div>}

async function getData(code) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${code}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function StatsPage({ params }) {
  const data = await getData(params.code);

  if (!data) {
    return <div style={{ padding: "20px" }}>Not found</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>
        Stats for {params.code}
      </h1>

      <p><b>Target URL:</b> {data.target_url}</p>
      <p><b>Clicks:</b> {data.clicks}</p>
      <p><b>Created:</b> {new Date(data.created_at).toLocaleString()}</p>
      <p><b>Last Clicked:</b> {data.last_clicked ? new Date(data.last_clicked).toLocaleString() : "Never"}</p>

      <a href="/" style={{ marginTop: "20px", display: "inline-block" }}>
        ← Back to Dashboard
      </a>
    </div>
  );
}
