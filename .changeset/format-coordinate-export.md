---
"@accelint/map-toolkit": minor
---

Export `formatCoordinate` and `normalizeLongitude` from `@accelint/map-toolkit/cursor-coordinates`. `formatCoordinate(lonLat, format)` is the pure formatter behind `useCursorCoordinates` — reach for it to render a DD/DDM/DMS/MGRS/UTM string outside the hook instead of re-deriving the grid-conversion logic.
