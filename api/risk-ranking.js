import { crops, CROP_IDS } from "../data/crops.js";
import { getQuery, sendJson } from "../utils/http.js";

const VALID_CONDITIONS = new Set(["heavy_rain", "high_temperature", "normal"]);

export default function handler(req, res) {
  const q = getQuery(req);
  const condition = String(q.condition ?? "");

  if (!VALID_CONDITIONS.has(condition)) {
    return sendJson(res, 400, {
      timestamp: new Date().toISOString(),
      model: "rule_based_v1",
      error: "invalid_condition",
      message:
        "Provide ?condition=heavy_rain|high_temperature|normal to rank crops."
    });
  }

  const ranking = CROP_IDS.map((product) => {
    const crop = crops[product];
    const d = crop?.conditions?.[condition];
    return {
      product,
      category: crop?.category ?? "unknown",
      severity: typeof d?.severity === "number" ? d.severity : 0,
      impact: d?.impact ?? { supply: "unknown", quality: "unknown" },
      reason: d?.reason ?? "No rule-based impact configured."
    };
  }).sort((a, b) => b.severity - a.severity);

  return sendJson(res, 200, {
    timestamp: new Date().toISOString(),
    model: "rule_based_v1",
    condition,
    ranking
  });
}

