---
"@accelint/map-toolkit": minor
---

Fix rotated ellipses being stretched into non-ellipse shapes during edit. Ellipses now use a new `'ellipse-transform'` edit mode (`EllipseTransformMode` + `EllipseScaleMode`) that places scale handles on the curve at the four axis endpoints (where the major and minor axes meet the boundary), projects axis-endpoint drags onto the dragged axis in Mercator space, and regenerates the polygon parametrically — so a rotated ellipse stays a clean rotated ellipse through any scale gesture. The rotate handle now sits on the most-northern axis endpoint instead of the axis-aligned bbox top-center. Hold Shift while dragging an axis endpoint to scale both axes uniformly (preserve aspect ratio).

**Note for consumers:** the edit-mode value the store assigns to an `EllipseShape` changes from `'bounding-transform'` to `'ellipse-transform'`. If you read `editingState.editMode` and compare against `'bounding-transform'` for an ellipse, update those checks to also accept `'ellipse-transform'` (or rely on `getEditModeForShape` / `useEditShape` to pick the right mode for you).
