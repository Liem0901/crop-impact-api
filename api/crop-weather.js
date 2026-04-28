import { crops } from "../data/crops.js";
import { getQuery, sendJson } from "../utils/http.js";
import { parseProductsParam } from "../utils/parseProducts.js";
import { getCurrentWeather } from "../utils/openMeteo.js";
import { simulateWeather } from "../utils/simulateWeather.js";
import { detectCondition, explainRule } from "../utils/weather.js";

const DEFAULT_LOCATION = Object.freeze({
  lat: 14.5995,
  lon: 120.9842
});

function toNumberOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

async function resolveWeather({ lat, lon }) {
  const latitude = toNumberOrNull(lat);
  const longitude = toNumberOrNull(lon);

  if (latitude == null || longitude == null) return simulateWeather();

  const live = await getCurrentWeather({ lat: latitude, lon: longitude });
  return live ?? simulateWeather();
}

function buildItemResult({ product, condition, weather, timestamp }) {
  const crop = crops[product];
  if (!crop) {
    return {
      product,
      timestamp,
      model: "rule_based_v1",
      condition,
      weather,
      error: "unknown_product",
      message: `Unknown product '${product}'.`
    };
  }

  const details = crop.conditions?.[condition];
  const impact = details?.impact ?? { supply: "unknown", quality: "unknown" };
  const severity = typeof details?.severity === "number" ? details.severity : 0;
  const reason = details?.reason ?? "No rule-based impact configured.";

  return {
    product,
    timestamp,
    model: "rule_based_v1",
    condition,
    impact,
    severity,
    reason,
    explanation: `${reason} (${explainRule({
      temp: weather.temp,
      rain: weather.rain,
      condition
    })})`
  };
}

export default async function handler(req, res) {
  const q = getQuery(req);
  const products = parseProductsParam(q.product);

  if (products.length === 0) {
    return sendJson(res, 400, {
      timestamp: new Date().toISOString(),
      model: "rule_based_v1",
      error: "missing_product",
      message:
        "Provide ?product=<crop_id> or comma-separated list like ?product=a,b"
    });
  }

  const lat = q.lat ?? DEFAULT_LOCATION.lat;
  const lon = q.lon ?? DEFAULT_LOCATION.lon;

  const weather = await resolveWeather({ lat, lon });
  const condition = detectCondition({ temp: weather.temp, rain: weather.rain });
  const timestamp = new Date().toISOString();

  const results = products.map((product) =>
    buildItemResult({ product, condition, weather, timestamp })
  );

  if (results.length === 1) {
    return sendJson(res, 200, results[0]);
  }

  return sendJson(res, 200, {
    timestamp,
    model: "rule_based_v1",
    condition,
    weather,
    results
  });
}

