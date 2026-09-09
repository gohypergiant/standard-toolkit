---
"@accelint/map-toolkit": minor
"@accelint/geo": patch
---

Export `formatCoordinate` and `normalizeLongitude` from `@accelint/map-toolkit/cursor-coordinates`. `formatCoordinate(lonLat, format)` is the pure formatter behind `useCursorCoordinates` — reach for it to render a DD/DDM/DMS/MGRS/UTM string outside the hook instead of re-deriving the grid-conversion logic.

Also fix a `RangeError` when formatting the exact UTM/MGRS latitude boundaries (84°N and 80°S) as MGRS or UTM. Both are valid coordinates in those systems, but the bundled `geodesy@2.4.0` rejected them — 84°N via too-strict northing bounds, 80°S via a floating-point precision error in the latitude-band lookup — and the throw propagated out of `formatCoordinate` and `@accelint/geo`'s `createCoordinate(...).mgrs()`/`.utm()`. Fixed via a patch to `geodesy` (`patches/geodesy@2.4.0.patch`) that back-ports the two fixes already on geodesy's `master` branch (no released version carries them). Coordinates just outside the valid band still report `valid: false` as before.
