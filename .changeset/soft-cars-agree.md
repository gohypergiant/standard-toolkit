---
"@accelint/map-toolkit": minor
---

Add `enableElevation` prop to DisplayShapeLayer for 3D shapes rendering.

Remove dotted border treatment on shape selection — interactions no longer modify a shape's innate styling.

Apply material-based brightness effect for hover and selection on all polygon shapes. All shapes brighten their outline color on hover or select (1.4×), with an even brighter combined state when both active (1.7×).

Add new Selection layer for brightness effect while shape is selected.

Add optional `maxElevation` property to `StyledFeatureProperties` as the source of truth for Polygon shape elevation. Point and LineString elevation is derived from z coordinates.
