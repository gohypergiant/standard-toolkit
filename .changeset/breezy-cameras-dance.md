---
"@accelint/map-toolkit": minor
---

Add WagonWheel shape type with MultiPolygon geometry support

- New `WagonWheel` shape type with center, radius, spokes, orientation, and range rings
- New `locked-bounding-transform` edit mode for uniform scaling (maintains circular aspect ratio)
- Circle property recomputation during drag for Circle and WagonWheel shapes
- Rotation angle tracking on feature properties during rotate drag
- MultiPolygon label positioning for wagon wheel shapes
- Distance unit support for circle radius computation during drawing
- Shape duplication support for WagonWheel (center offset, property preservation)
