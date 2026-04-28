export function detectCondition({ temp, rain }) {
  const t = Number(temp);
  const r = Number(rain);

  if (Number.isFinite(r) && r > 20) return "heavy_rain";
  if (Number.isFinite(t) && t > 32) return "high_temperature";
  return "normal";
}

export function explainRule({ temp, rain, condition }) {
  if (condition === "heavy_rain") return `rain (${rain}mm) > 20mm → heavy_rain`;
  if (condition === "high_temperature")
    return `temp (${temp}°C) > 32°C → high_temperature`;
  return `rain (${rain}mm) ≤ 20mm and temp (${temp}°C) ≤ 32°C → normal`;
}

