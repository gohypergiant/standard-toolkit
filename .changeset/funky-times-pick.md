---
'@accelint/map-toolkit': minor
---

Refresh the bounding-box and rotation-handle visuals for shape editing.

- Rotation handles for rectangles and ellipses now lock to the most-northern edge / axis endpoint at edit-session start and stay attached to that shape-local point through every gesture in the session — the handle starts on the visible top of the shape and rides along with rotations rather than hopping back to the new geographic top after each rotate. The lock resets when a different shape is opened for editing.
- The polygon and line bounding box now renders with a dashed, muted line and a small outward buffer between the box and the shape so vertex handles and scale handles can't visually overlap. Scale corner handles, the rotate handle, and vertex handles each use a distinct color (turquoise / amber / white) so the three affordances are easy to tell apart.
- The polygon and line bounding box now stays aligned with the shape across rotations — it tracks cumulative rotation since edit-session start and renders as an oriented bounding box rotated to match, instead of snapping back to a north-aligned bounding box after each rotate. Non-uniform scaling on a rotated polygon/line now operates in the polygon's local frame, so dragging a corner stretches the shape along its own axes rather than world X/Y (which previously sheared rotated polygons into slivers).
- `EditShapeLayer` now accepts a `style` prop covering the full edit-handle and bounding-box surface — fill color, outline color, and radius for each of the three handle roles (`vertex`, `scale`, `rotate`), plus `editHandleStrokeWidth`, `editHandleOutline`, `bboxLineColor`, `bboxLineWidth`, and `bboxDashArray`. Each field is independently overridable; omitted fields use the package defaults.
