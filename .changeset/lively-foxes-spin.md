---
"@accelint/map-toolkit": minor
---

Fix rotated ellipses being stretched into non-ellipse shapes during edit. Ellipses now use a new `'ellipse-transform'` edit mode (`EllipseTransformMode` + `EllipseScaleMode`) that places scale handles on the curve at the four axis endpoints (where the major and minor axes meet the boundary), projects axis-endpoint drags onto the dragged axis in Mercator space, and regenerates the polygon parametrically — so a rotated ellipse stays a clean rotated ellipse through any scale gesture. Hold Shift while dragging an axis endpoint to scale both axes uniformly (preserve aspect ratio).

The rotate handle for ellipses is repositioned outside whichever axis endpoint is currently most-northern, with a short connector stem extending outward along that axis (perpendicular to the curve's tangent at that point). The same connector-stem treatment is also applied to the rectangle rotate handle in this release: rectangles' rotate handle now sits outside the most-northern edge with a stem perpendicular to that edge in Mercator space, replacing the bare on-edge placement that shipped with `'rectangle-transform'`. Both stems use the same fixed geographic length matching `@deck.gl-community`'s `RotateMode` connector formula, so the rotate handles read consistently across rectangle and ellipse at any zoom level.

**Note for consumers:** the edit-mode value the store assigns to an `EllipseShape` changes from `'bounding-transform'` to `'ellipse-transform'`. If you read `editingState.editMode` and compare against `'bounding-transform'` for an ellipse, update those checks to also accept `'ellipse-transform'` (or rely on `getEditModeForShape` / `useEditShape` to pick the right mode for you).
