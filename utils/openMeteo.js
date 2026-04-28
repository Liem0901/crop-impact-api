const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getCurrentWeather({ lat, lon, timeoutMs = 3500 }) {
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,precipitation");
  url.searchParams.set("timezone", "UTC");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;

    const json = await res.json();
    const current = json?.current;

    const temp = Number(current?.temperature_2m);
    const rain = Number(current?.precipitation);
    if (!Number.isFinite(temp) || !Number.isFinite(rain)) return null;

    return { temp, rain, source: "open_meteo" };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

