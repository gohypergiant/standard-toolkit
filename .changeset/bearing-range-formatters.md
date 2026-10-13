---
"@accelint/formatters": minor
---

- Implement `formatBearing()` and add `formatDistance()`.
- `formatBearing(degrees)` formats a bearing value as a zero-padded 3-digit string with a degree symbol (e.g. `45` → `"045°"`). Wraps negative values and values over 360 into the `0–360` range with `wrap()` from `@accelint/math`, and rounds fractional bearings to the nearest whole degree. Throws a `RangeError` for `NaN` or infinite input.
- `formatDistance(meters, units)` converts a distance in meters to a human-readable string. Accepts a single unit (`'kilometers'` → `"42.3 km"`) or dual units (`['kilometers', 'nauticalmiles']` → `"42.3 km / 22.8 NM"`). Conversion uses `METERS_PER_UNIT` and symbols use `DISTANCE_UNIT_SYMBOLS`, both from `@accelint/constants/units`. Throws an `Error` for an empty unit list, more than two units, or an unsupported unit, and a `RangeError` for `NaN` or infinite `meters`.
