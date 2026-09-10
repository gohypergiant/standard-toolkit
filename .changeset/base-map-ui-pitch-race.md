---
"@accelint/map-toolkit": patch
---

Fix the camera store leaving a stale tilt when a UI control switches the view from 2.5D to 2D. The `setView` bus handler only reset pitch on the way into 3D, so a 2.5D → 2D toggle stored `{ view: '2D', pitch: 60 }` and `BaseMap` rendered a tilted "2D" map until the next pan re-synced it. `setView` now rebuilds state through the same path as every other camera event, so 2D and 3D are always flat and 2.5D enters at its default 60° tilt.
