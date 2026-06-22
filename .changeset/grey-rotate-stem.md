---
"@accelint/map-toolkit": patch
---

Fix the rotate-handle connector stem inheriting the shape's line color while editing. The `rotate-stem` guide is edit chrome, so it now renders with the bounding-box line color/width (`bboxLineColor`/`bboxLineWidth`) like the bounding box itself, independent of the shape's own `lineColor`.
