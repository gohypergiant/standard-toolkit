---
"@accelint/map-toolkit": minor
---

Add CoffinCornerExtension: a GPU-based shader extension that draws bracket-shaped selection/hover indicators around Point shapes using signed distance functions. Replaces the previous icon-atlas approach for coffin corners in shapes layers, removing the dependency on consumer-provided sprite sheets.

- New `CoffinCornerExtension` layer extension for IconLayer, SymbolLayer, and ScatterplotLayer
- New `useCoffinCorner` React hook for automatic map bus event wiring
- New `coffinCornerStore` for framework-agnostic imperative usage
- DisplayShapeLayer now uses shader coffin corners for all Point geometries and forwards `highlightColor` as the bracket fill color
