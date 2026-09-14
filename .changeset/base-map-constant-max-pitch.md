---
"@accelint/map-toolkit": patch
---

Fix `BaseMap` losing its 2.5D tilt on maplibre-gl 5.17.0 and later: switching a flat 2D map to 2.5D left it at pitch 0. `BaseMap` toggled MapLibre's `maxPitch` per view, and from 5.17.0 `setMaxPitch` fires a `move` event carrying the pre-props pitch, which `BaseMap` wrote back into the camera store. The ceiling is now a constant `MAX_PITCH`; flat views were already held at pitch 0 by the store, so nothing else changes.

The `maplibre-gl` optional dependency range moves from `^5.7.1` to `^5.24.0`. A consumer on an older 5.x gets a nested second copy of `maplibre-gl` (and of `react-map-gl`) under this package until it upgrades, so bump `maplibre-gl` alongside this release.
