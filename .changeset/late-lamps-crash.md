---
"@accelint/map-toolkit": patch
---

Extend CoffinCornerExtension to support ScatterplotLayer (circle points without icons) alongside IconLayer, and refine DisplayShapeLayer integration.

- CoffinCornerExtension now supports ScatterplotLayer with quad expansion and circle-replicating fragment shaders
- DisplayShapeLayer skips the highlight outline layer for all Point geometries (coffin corner brackets handle hover/select feedback)
- DisplayShapeLayer forwards `highlightColor` as the bracket fill color via a cached tuple to avoid per-render allocations
- Stable `DISPLAY_EXTENSIONS` module-level constant prevents unnecessary `getShaders()` re-evaluation
- Removed icon-atlas-based coffin corner SVG sprites (replaced by shader SDF rendering)
