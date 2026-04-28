import React, { useMemo, useState } from "react";

const DEFAULTS = {
  product: "green_coral_lettuce,romaine_lettuce",
  lat: "14.5995",
  lon: "120.9842",
  condition: "heavy_rain"
};

const CROP_EXAMPLES = [
  "green_coral_lettuce",
  "romaine_lettuce",
  "butterhead_lettuce",
  "japanese_cucumber",
  "cherry_tomato",
  "crystal_tomato"
];

function Code({ children }) {
  return <code className="code">{children}</code>;
}

function prettyJson(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function App() {
  const [product, setProduct] = useState(DEFAULTS.product);
  const [lat, setLat] = useState(DEFAULTS.lat);
  const [lon, setLon] = useState(DEFAULTS.lon);
  const [condition, setCondition] = useState(DEFAULTS.condition);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const cropWeatherUrl = useMemo(() => {
    const u = new URL("/api/crop-weather", window.location.origin);
    u.searchParams.set("product", product.trim());
    if (lat.trim()) u.searchParams.set("lat", lat.trim());
    if (lon.trim()) u.searchParams.set("lon", lon.trim());
    return u.toString();
  }, [product, lat, lon]);

  const rankingUrl = useMemo(() => {
    const u = new URL("/api/risk-ranking", window.location.origin);
    u.searchParams.set("condition", condition);
    return u.toString();
  }, [condition]);

  async function run(url) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(url);
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.message || `Request failed (${res.status})`);
        setResult(json);
        return;
      }
      setResult(json);
    } catch (e) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <div className="kicker">Serverless API on Vercel</div>
          <h1>Crop Weather Impact API</h1>
          <p className="sub">
            Rule-based classification of current weather (Open‑Meteo + fallback)
            and crop-specific impact output.
          </p>
        </div>
        <div className="pill">
          <div className="pillLabel">Model</div>
          <div className="pillValue">rule_based_v1</div>
        </div>
      </header>

      <section className="grid">
        <div className="card">
          <h2>Endpoints</h2>
          <ul className="list">
            <li>
              <div className="row">
                <span className="method">GET</span>
                <a href={cropWeatherUrl}>
                  <Code>/api/crop-weather</Code>
                </a>
              </div>
              <div className="muted">
                Query: <Code>product</Code>, optional <Code>lat</Code> /{" "}
                <Code>lon</Code>
              </div>
            </li>
            <li>
              <div className="row">
                <span className="method">GET</span>
                <a href={rankingUrl}>
                  <Code>/api/risk-ranking</Code>
                </a>
              </div>
              <div className="muted">
                Query: <Code>condition</Code>
              </div>
            </li>
          </ul>
          <div className="note">
            Tip: Hitting <Code>/api</Code> rewrites to <Code>/api/crop-weather</Code>.
          </div>
        </div>

        <div className="card">
          <h2>Try it</h2>
          <div className="form">
            <label>
              Products (comma-separated)
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="green_coral_lettuce,romaine_lettuce"
              />
            </label>

            <div className="cols">
              <label>
                Lat
                <input value={lat} onChange={(e) => setLat(e.target.value)} />
              </label>
              <label>
                Lon
                <input value={lon} onChange={(e) => setLon(e.target.value)} />
              </label>
            </div>

            <div className="actions">
              <button
                className="btn"
                onClick={() => run(cropWeatherUrl)}
                disabled={loading}
              >
                Fetch crop weather
              </button>
              <a className="btnSecondary" href={cropWeatherUrl}>
                Open URL
              </a>
            </div>

            <label>
              Risk ranking condition
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="heavy_rain">heavy_rain</option>
                <option value="high_temperature">high_temperature</option>
                <option value="normal">normal</option>
              </select>
            </label>

            <div className="actions">
              <button
                className="btn"
                onClick={() => run(rankingUrl)}
                disabled={loading}
              >
                Fetch risk ranking
              </button>
              <a className="btnSecondary" href={rankingUrl}>
                Open URL
              </a>
            </div>
          </div>

          <div className="examples">
            <div className="muted">Available crop ids:</div>
            <div className="chips">
              {CROP_EXAMPLES.map((c) => (
                <button
                  key={c}
                  className="chip"
                  onClick={() =>
                    setProduct((prev) =>
                      prev.trim() ? `${prev.trim()},${c}` : c
                    )
                  }
                  type="button"
                >
                  {c}
                </button>
              ))}
              <button
                className="chipDanger"
                onClick={() => setProduct("")}
                type="button"
              >
                clear
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Result</h2>
        {loading ? (
          <div className="muted">Loading…</div>
        ) : error ? (
          <div className="error">
            <div className="errorTitle">Error</div>
            <div className="errorMsg">{error}</div>
          </div>
        ) : (
          <div className="muted">Run a request to see JSON output here.</div>
        )}

        {result ? <pre className="pre">{prettyJson(result)}</pre> : null}
      </section>

      <footer className="footer">
        <div className="muted">
          Weather rules: <Code>rain &gt; 20</Code> → heavy_rain,{" "}
          <Code>temp &gt; 32</Code> → high_temperature, else normal.
        </div>
      </footer>
    </div>
  );
}

