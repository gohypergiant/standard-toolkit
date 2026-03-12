---
"@accelint/map-toolkit": patch
---

- When using icons for Point shapes, `EditShapeLayer` now displays icon markers during editing instead of plain circles. 
- `DrawShapeLayer` and `EditShapeLayer` now self-register their fiber dependencies and no longer require manual fiber imports.
- `useEditShape()` now exposes `updateFeature` to allow form-based updates before saving edits
