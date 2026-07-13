---
"@accelint/formatters": minor
---

- Implement `formatBearing()` and add `formatDistance()`.
- `formatBearing(degrees)` formats a bearing value as a zero-padded 3-digit string with a degree symbol (e.g. `45` → `"045°"`). Normalizes negative values and values over 360 via modulo arithmetic.
- `formatDistance(meters, units)` converts a distance in meters to a human-readable string. Accepts a single unit (`'kilometers'` → `"42.3 km"`) or dual units (`['kilometers', 'nauticalmiles']` → `"42.3 km / 22.8 NM"`). Uses `DISTANCE_UNIT_SYMBOLS` from `@accelint/constants/units` for abbreviations.
