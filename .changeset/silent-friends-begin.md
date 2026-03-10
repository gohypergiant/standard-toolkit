---
"@accelint/map-toolkit": minor
---

Add radius label on hover for circle shapes in `DisplayShapeLayer`. When hovering a circle, the radius is displayed in the configured `unit` (defaults to nautical miles). The label positions relative to the shape's text label: below it when `showLabels` is `'always'` or `'hover'`, and in its place when `showLabels` is `'never'`. Also adds the `unit` prop to `DisplayShapeLayerProps` for configuring distance display units.
