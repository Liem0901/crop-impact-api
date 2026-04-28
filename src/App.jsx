import React, { useMemo, useState } from "react";
import Select from "react-select";
import LoadingSpinner from "./components/LoadingSpinner";

const DEFAULTS = {
  product: "green_coral_lettuce",
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

const SABAH_DISTRICTS = [
  { label: "Kota Kinabalu", lat: "5.9804", lon: "116.0735" },
  { label: "Sandakan", lat: "5.8402", lon: "118.1179" },
  { label: "Tawau", lat: "4.2448", lon: "117.8914" },
  { label: "Lahad Datu", lat: "5.0274", lon: "118.3271" },
  { label: "Keningau", lat: "5.3374", lon: "116.1613" },
  { label: "Beaufort", lat: "5.3456", lon: "115.7517" },
  { label: "Kota Belud", lat: "6.3500", lon: "116.4333" },
  { label: "Kudat", lat: "6.8876", lon: "116.8470" },
  { label: "Semporna", lat: "4.4798", lon: "118.6104" },
  { label: "Papar", lat: "5.7333", lon: "115.9333" },
  { label: "Ranau", lat: "5.9588", lon: "116.6693" },
  { label: "Tuaran", lat: "6.1833", lon: "116.2333" },
  { label: "Penampang", lat: "5.9167", lon: "116.1000" },
  { label: "Putatan", lat: "5.8667", lon: "116.0833" },
  { label: "Kota Marudu", lat: "6.1833", lon: "116.8667" },
  { label: "Pitas", lat: "6.8000", lon: "117.1333" },
  { label: "Beluran", lat: "5.8000", lon: "117.6000" },
  { label: "Kinabatangan", lat: "5.4167", lon: "118.0000" },
  { label: "Telupid", lat: "5.7167", lon: "117.1167" },
  { label: "Tongod", lat: "5.5167", lon: "117.2167" },
  { label: "Nabawan", lat: "4.9167", lon: "116.2167" },
  { label: "Tenom", lat: "5.1167", lon: "115.9500" },
  { label: "Sipitang", lat: "5.0933", lon: "115.5600" },
  { label: "Kuala Penyu", lat: "5.6167", lon: "115.6167" },
  { label: "Kota Kinabatangan", lat: "5.4167", lon: "118.4333" },
  { label: "Kalabakan", lat: "4.3500", lon: "117.4667" },
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
  const [products, setProducts] = useState(() =>
    DEFAULTS.product.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  const [lat, setLat] = useState(DEFAULTS.lat);
  const [lon, setLon] = useState(DEFAULTS.lon);
  const [condition, setCondition] = useState(DEFAULTS.condition);
  const [district, setDistrict] = useState(null);
  const [geoSuccess, setGeoSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const cropWeatherUrl = useMemo(() => {
    const u = new URL("/api/crop-weather", window.location.origin);
    const productParam = products.join(",");
    if (productParam.trim()) u.searchParams.set("product", productParam.trim());
    if (lat.trim()) u.searchParams.set("lat", lat.trim());
    if (lon.trim()) u.searchParams.set("lon", lon.trim());
    return u.toString();
  }, [products, lat, lon]);

  const rankingUrl = useMemo(() => {
    const u = new URL("/api/risk-ranking", window.location.origin);
    u.searchParams.set("condition", condition);
    return u.toString();
  }, [condition]);

  const cropOptions = useMemo(
    () => CROP_EXAMPLES.map((c) => ({ value: c, label: c })),
    []
  );

  const selectedCropOptions = useMemo(() => {
    const selected = new Set(products);
    return cropOptions.filter((o) => selected.has(o.value));
  }, [cropOptions, products]);

  const conditionOptions = useMemo(
    () => [
      { value: "heavy_rain", label: "heavy_rain" },
      { value: "high_temperature", label: "high_temperature" },
      { value: "normal", label: "normal" }
    ],
    []
  );

  const selectStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        minHeight: 42,
        borderRadius: 12,
        borderColor: state.isFocused ? "rgba(124, 92, 255, 0.55)" : "var(--border)",
        boxShadow: state.isFocused ? "0 0 0 1px rgba(124, 92, 255, 0.35)" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.18)"
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "2px 10px"
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "rgba(20, 20, 40, 0.98)"
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "rgba(124, 92, 255, 0.45)"
          : state.isFocused
            ? "rgba(124, 92, 255, 0.18)"
            : "transparent",
        color: "var(--text)"
      }),
      singleValue: (base) => ({ ...base, color: "var(--text)" }),
      placeholder: (base) => ({ ...base, color: "var(--muted)" }),
      input: (base) => ({ ...base, color: "var(--text)" }),
      multiValue: (base) => ({
        ...base,
        borderRadius: 999,
        border: "1px solid var(--border)",
        backgroundColor: "var(--panel)"
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: "var(--text)",
        fontSize: 12.5,
        padding: "4px 6px 4px 10px"
      }),
      multiValueRemove: (base) => ({
        ...base,
        borderRadius: 999,
        color: "var(--muted)",
        paddingLeft: 6,
        paddingRight: 8,
        ":hover": {
          backgroundColor: "rgba(251, 113, 133, 0.12)",
          color: "var(--text)"
        }
      }),
      indicatorSeparator: (base) => ({ ...base, backgroundColor: "var(--border)" }),
      dropdownIndicator: (base) => ({ ...base, color: "var(--muted)" }),
      clearIndicator: (base) => ({ ...base, color: "var(--muted)" })
    }),
    []
  );
  const [geoLoading, setGeoLoading] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");

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

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    setLocationLabel("");
    setDistrict(null);
    setGeoSuccess(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude.toFixed(4)));
        setLon(String(pos.coords.longitude.toFixed(4)));
        setLocationLabel("📍 Using your location");
        setGeoSuccess(true);
        setGeoLoading(false);
      },
      () => {
        alert("Unable to retrieve your location.");
        setGeoLoading(false);
      }
    );
  }

  const districtOptions = useMemo(
    () => SABAH_DISTRICTS.map((d) => ({ value: d.label, label: d.label, lat: d.lat, lon: d.lon })),
    []
  );

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
              Products (crop ids)
              <Select
                inputId="product"
                isClearable
                isSearchable
                isMulti
                options={cropOptions}
                value={selectedCropOptions}
                onChange={(opts) => {
                  const next = (opts ?? []).map((o) => o.value);
                  setProducts(Array.from(new Set(next)));
                }}
                placeholder="Select one or more crop ids…"
                styles={selectStyles}
              />
            </label>

            {/* Location controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label>
                Sabah District (quick-fill)
                <Select
                  inputId="district"
                  isClearable
                  isSearchable
                  options={districtOptions}
                  value={district}
                  onChange={(opt) => {
                    if (opt) {
                      setDistrict(opt);
                      setLat(opt.lat);
                      setLon(opt.lon);
                      setLocationLabel(opt.label);
                      setGeoSuccess(false);
                    } else {
                      setDistrict(null);
                      setLocationLabel("");
                    }
                  }}
                  placeholder="Pick a Sabah district…"
                  styles={selectStyles}
                />
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr auto",
                  gap: 12,
                  alignItems: "end"
                }}
              >
                <label>
                  Lat
                  <input
                    value={lat}
                    onChange={(e) => {
                      setLat(e.target.value);
                      setLocationLabel("");
                      setDistrict(null);
                      setGeoSuccess(false);
                    }}
                  />
                </label>
                <label>
                  Lon
                  <input
                    value={lon}
                    onChange={(e) => {
                      setLon(e.target.value);
                      setLocationLabel("");
                      setDistrict(null);
                      setGeoSuccess(false);
                    }}
                  />
                </label>
                <button
                  type="button"
                  className={`btnSecondary iconBtn${geoSuccess ? " iconBtnSuccess" : ""}`}
                  onClick={useCurrentLocation}
                  disabled={geoLoading}
                  title="Use my location"
                  aria-label="Use my location"
                >
                  {geoLoading ? <LoadingSpinner /> : <i className="bi bi-geo-alt"></i>}
                </button>
              </div>

              {locationLabel ? (
                <div className="muted" style={{ fontSize: 12.5 }}>
                  {locationLabel}
                </div>
              ) : null}
            </div>

            <div className="actions">
              <button
                className="btn"
                onClick={() => run(cropWeatherUrl)}
                disabled={loading || products.length === 0}
              >
                Fetch crop weather
              </button>
              <a className="btnSecondary" href={cropWeatherUrl}>
                Open URL
              </a>
            </div>

            <label>
              Risk ranking condition
              <Select
                inputId="condition"
                isSearchable={false}
                options={conditionOptions}
                value={conditionOptions.find((o) => o.value === condition) ?? null}
                onChange={(opt) => setCondition(opt?.value ?? "normal")}
                styles={selectStyles}
              />
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

        </div>

        <section className="card gridFull">
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

