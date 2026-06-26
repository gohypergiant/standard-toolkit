---
"@accelint/map-toolkit": minor
---

Add `MaskedIconLayer`, and wire point-shape icons in `DisplayShapeLayer` to recolor their maskable (pink, `#FF69B4`) region in real time from `styleProperties.fillColor`. Icons without a maskable region render unchanged. `CoffinCornerExtension` now detects a `MaskedIconLayer` host and automatically composites its selection/hover brackets over the recolored icon — no separate extension needed. New subpath exports: `@accelint/map-toolkit/deckgl/masked-icon-layer` (+ `/fiber`).
