---
"@accelint/map-toolkit": minor
"@accelint/geo": patch
---

Export `formatCoordinate` and `normalizeLongitude` from `@accelint/map-toolkit/cursor-coordinates`. `formatCoordinate(lonLat, format)` is the pure formatter behind `useCursorCoordinates` — reach for it to render a DD/DDM/DMS/MGRS/UTM string outside the hook instead of re-deriving the grid-conversion logic.

Also stop a `RangeError` escaping `formatCoordinate` at the UTM/MGRS latitude boundaries (84°N and 80°S). Both are valid in those systems, but `geodesy@2.4.0` rejected them — 84°N via too-strict northing bounds (widest in the extended Svalbard zones), 80°S via a floating-point error in the latitude-band lookup. Two layers: this monorepo patches `geodesy` (`patches/geodesy@2.4.0.patch`, a workspace-only pnpm patch that does not ship in the published package), and `@accelint/geo`'s grid-parts functions now return `{ ok: false }` instead of throwing whenever geodesy rejects a coordinate — so `formatCoordinate` shows the `--- -- ---- ----` placeholder rather than crashing, even against an unpatched `geodesy`. Coordinates outside the valid band still report `valid: false` as before.
