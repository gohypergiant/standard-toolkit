---
"@accelint/map-toolkit": patch
---

Fix `BaseMap` losing the 2.5D tilt on maplibre-gl 5.2x: switching a flat 2D map to 2.5D left it at pitch 0 even though the camera store had moved to 60°. `BaseMap` used to toggle MapLibre's `maxPitch` per view (0 in 2D/3D, 85 in 2.5D). From maplibre-gl 5.2x, `map.setMaxPitch` runs the camera through `transformCameraUpdate` (where react-maplibre re-applies the current props) and then fires a `move` event carrying the pre-props camera, so `BaseMap`'s `onMove` wrote that stale pitch 0 back into the store in the same tick. The ceiling is now a constant `MAX_PITCH`; flat views were already held at pitch 0 by the camera store, so no behavior changes there. The `maplibre-gl` range moves to `^5.24.0`.
