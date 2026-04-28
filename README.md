# Crop Weather Impact API

Serverless (Vercel) API that classifies **current weather** and returns **crop-specific impact** using a simple rule-based model.

## Endpoints

### `GET /api/crop-weather`

Query:
- `product`: crop id, or comma-separated ids (e.g. `green_coral_lettuce,romaine_lettuce`)
- `lat`, `lon` (optional): location for Open‑Meteo lookup. If omitted, defaults to Manila (`14.5995,120.9842`).

Example:
- `/api/crop-weather?product=green_coral_lettuce`
- `/api/crop-weather?product=green_coral_lettuce,romaine_lettuce&lat=14.6&lon=121.0`

Response (single product):
- `timestamp`
- `model`: `"rule_based_v1"`
- `product`
- `condition`: `heavy_rain | high_temperature | normal`
- `impact`: `{ supply, quality }`
- `severity`: `0..1`
- `reason`
- `explanation`

### `GET /api/risk-ranking`

Query:
- `condition`: `heavy_rain | high_temperature | normal`

Example:
- `/api/risk-ranking?condition=heavy_rain`

Response:
- `timestamp`
- `model`: `"rule_based_v1"`
- `condition`
- `ranking`: crops sorted by `severity` (desc)

## How it works (rule-based)
- Weather is fetched from **Open‑Meteo** (current temperature + precipitation) when `lat` and `lon` are provided (or when defaults apply).
- If fetching fails, the API falls back to **simulated weather** and sets `weather.source` to `"fallback_simulated"`.
- Condition rules:
  - `rain > 20` → `heavy_rain`
  - `temp > 32` → `high_temperature`
  - else → `normal`

