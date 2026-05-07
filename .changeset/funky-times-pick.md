---
"@accelint/map-toolkit": major
---

**Breaking:** Reworks how `DisplayShapeLayer` renders hover and select fill states. The behavior of `selectedShapeId`, hover state, and the `DISPLAY_SELECTION` / `DISPLAY-hover` sublayer ids has changed. Adds optional accessor props for overriding the fill color of the active feature.

### Breaking changes

- **Removed `SHAPE_LAYER_IDS.DISPLAY_SELECTION`.** The selection-overlay sublayer no longer exists, and its id is no longer exported from `@accelint/map-toolkit/deckgl/shapes`. Any code that referenced this constant for picking-info filtering, layer-id matching, or debug overlays must be updated. The hover sublayer (which had no exported constant; its id was `${layerId}-${SHAPE_LAYER_IDS.DISPLAY}-hover`) is also gone.
- **Default fill-color rendering for selected and hovered shapes changed.** Previously the active feature's fill was produced by stacking a separate overlay sublayer on top of the main fill, with material-based lighting brightening the result on 3D extruded shapes. Now the main layer's `getFillColor` accessor returns a brightened color directly per feature, mirroring the existing `getLineColor` behavior. Pixel-level output differs in three ways:
  - No more alpha-blending stack (the active feature's color is the literal RGBA returned by the accessor; it isn't blended through the dimmed main fill).
  - No more 3D material-lighting variation across surface normals — extruded side faces no longer pick up extra brightness at oblique angles.
  - The brightening factor (`1.4×` for "hovered or selected", `1.7×` for "both") is applied to the un-dimmed base color rather than the `applyBaseOpacity`-reduced base, so active features read more vividly against their dimmed neighbors.

### Migration

- Replace any `SHAPE_LAYER_IDS.DISPLAY_SELECTION` reference with `SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT` (if you wanted the selection outline) or `SHAPE_LAYER_IDS.DISPLAY` (if you wanted the layer the active feature now lives on). If you were filtering picking events by sublayer id, the active-fill case is now handled by the main layer.
- If you had visual regression snapshots or color-sensitive tests on selected/hovered shapes, regenerate them. The new colors are intentional and should read more clearly, but they are different.
- If you depended on the 3D material-lighting cue specifically, set `getHoverFillColor` / `getSelectFillColor` to a brighter color of your choosing, or file an issue describing the use case.

### Added

- **`getHoverFillColor`** prop: `(feature: ShapeFeature) => Rgba255Tuple`. When set, the main layer's fill accessor returns this function's result for the hovered feature instead of the default brightening. No-op for shapes that render no fill (LineStrings) or whose color is driven by an icon atlas.
- **`getSelectFillColor`** prop: same shape, applied when a feature is selected. The selection outline color is unaffected and is still driven by `highlightColor`.
- When a shape is both hovered and selected and both overrides are set, `getHoverFillColor` wins.
