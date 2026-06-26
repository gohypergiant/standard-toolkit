---
"@accelint/map-toolkit": minor
---

Add `MaskedIconLayer` and `MaskedCoffinCornerExtension`, and wire point-shape icons in `DisplayShapeLayer` to recolor their maskable (pink, `#FF69B4`) region in real time from `styleProperties.fillColor`. Icons without a maskable region render unchanged. Pair `MaskedIconLayer` with `MaskedCoffinCornerExtension` so selection/hover brackets composite over the recolored icon. New subpath exports: `@accelint/map-toolkit/deckgl/masked-icon-layer` (+ `/fiber`) and `.../extensions/coffin-corner/masked-coffin-corner-extension`.
