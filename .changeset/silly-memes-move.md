---
"@accelint/map-toolkit": minor
---

Add click-to-place editing for Point shapes in EditShapeLayer.

Point shapes now use a new `point-translate` edit mode that supports two ways to reposition:
- **Click anywhere on the map** to instantly move the point to that location
- **Drag the point directly** for traditional drag behavior

This improves UX for points which previously required precise clicking on a very small target area.
