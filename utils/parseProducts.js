export function parseProductsParam(value) {
  const raw = Array.isArray(value) ? value.join(",") : value;
  if (typeof raw !== "string") return [];

  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

