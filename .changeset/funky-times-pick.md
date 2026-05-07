---
"@accelint/map-toolkit": minor
---

Adds optional fill-color overrides for the hover and select overlay sublayers in `DisplayShapeLayer`.

- **Added `getHoverFillColor`** prop: `(feature: ShapeFeature) => Rgba255Tuple`. When provided, replaces the default brightness-based fill on the hover overlay with the returned color. Polygon shapes only (Polygon, Rectangle, Circle, Ellipse, WagonWheel) — no-op for Point and LineString since they have no fill overlay.
- **Added `getSelectFillColor`** prop: `(feature: ShapeFeature) => Rgba255Tuple`. Same behavior for the selection overlay. The selection outline color is unaffected and still driven by `highlightColor`.
- The default brightness overlay applies when these props are omitted. Border brightness and width changes from the default hover/select treatment continue to apply in both cases.
