---
'@accelint/map-toolkit': patch
---

Fix `BaseMap` runtime error "Style is not done loading." when `defaultView='3D'` (globe projection). Projection is now applied via `setProjection` after MapLibre's style has loaded, instead of being passed as the initial `projection` prop to `react-map-gl/maplibre`.
