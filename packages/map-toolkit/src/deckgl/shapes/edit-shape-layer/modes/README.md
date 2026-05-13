# Edit Shape Layer Modes

This directory contains the edit modes used by `EditShapeLayer` for transforming shapes on the map.

## Architecture Overview

The modes follow a **leaf mode / composite mode** pattern from `@deck.gl-community/editable-layers`:

- **Leaf modes**: Handle a single type of operation (scale, rotate, translate, modify, resize)
- **Composite modes**: Combine multiple leaf modes and delegate based on what's being dragged
- **Utility modules** (under `utils/`): Pure math, guide manipulation, and the orientation-lock state machine. No deck.gl base classes — just functions and state objects.

```text
@deck.gl-community/editable-layers
├── ScaleMode (leaf)
├── RotateMode (leaf)
├── TranslateMode (leaf)
├── ModifyMode (leaf)
├── ResizeCircleMode (leaf)
└── CompositeMode (composite base)

map-toolkit/edit-shape-layer/modes
├── ScaleModeWithFreeTransform extends ScaleMode (leaf)
│   ├── ShapeAwareScaleMode (abstract — for modes that need shape-aware geometry)
│   │   ├── RectangleScaleMode (rotation-aware corner drag for rectangles)
│   │   └── EllipseScaleMode (axis-endpoint handles + Mercator projection)
│   └── OrientedScaleMode (Mercator local-frame non-uniform scaling for rotated polygons/lines)
├── RotateModeWithSnap extends RotateMode (leaf)
├── PointTranslateMode extends GeoJsonEditMode (composite, click-to-place semantics)
├── BaseTransformMode extends CompositeMode (composite base)
│   ├── CircleTransformMode
│   ├── BoundingTransformMode (generic axis-bounded fallback)
│   ├── LockedBoundingTransformMode (uniform-scale-only variant)
│   ├── RectangleTransformMode
│   ├── EllipseTransformMode
│   └── VertexTransformMode
└── utils/
    ├── ellipse-scale-math.ts        (axis-endpoint projection + scale factors)
    ├── mercator.ts                  (lat ↔ Mercator-y helpers)
    ├── orientation-lock.ts          (per-session rotation accumulator + scale-drag snapshot)
    ├── rectangle-scale-math.ts      (rotated-rectangle corner reconstruction)
    ├── scale-mode-internals.ts     (typed cast to ScaleMode's private fields)
    ├── session-cache.ts             (shape-id-keyed single-slot cache shared by transform modes)
    ├── transform-mode-guides.ts     (rotate-stem geometry + guide post-processing)
    ├── vertex-bbox-chrome.ts        (oriented-bounding-box chrome for polygons/lines)
    └── vertex-bbox-math.ts          (oriented-bounding-box computation for polygons/lines, Mercator-space)
```

## Leaf Modes

### ScaleModeWithFreeTransform

Extends `ScaleMode` to support non-uniform (free) scaling.

- **Default**: Free scaling — can stretch/squish in any direction.
- **With Shift (`lockScaling`)**: Uniform scaling — maintains aspect ratio.

The parent `ScaleMode` only supports uniform scaling. This extension calculates separate X/Y scale factors based on cursor movement relative to the opposite corner anchor point.

### ShapeAwareScaleMode (abstract)

Base for scale modes that need shape-specific geometry knowledge (rectangle corners, ellipse axis endpoints). Concrete subclasses replace the default axis-aligned bbox handles with handles on the shape's own geometry.

### RectangleScaleMode

Places scale handles at the rectangle's four rotated corners (not the lat/lon-axis bbox). Each corner drag projects the cursor onto the rectangle's local edge directions, so a rotated rectangle resizes without shearing into a parallelogram. Used by `RectangleTransformMode`.

### EllipseScaleMode

Places scale handles on the ellipse curve at the four axis endpoints (where the major and minor axes meet the boundary). Drags project the cursor onto the dragged axis in Mercator space and regenerate the polygon parametrically, keeping a rotated ellipse a clean ellipse instead of stretching it into a non-ellipse. Used by `EllipseTransformMode`.

### OrientedScaleMode

Extends `ScaleModeWithFreeTransform` for **rotated polygons and lines**. Receives the cumulative session rotation angle via `modeConfig.bboxOrientationAngle` (piped in by `VertexTransformMode`'s `OrientationLock`) and runs the non-uniform scale in the polygon's *local Mercator* frame — projects each vertex to Mercator-y, un-rotates around the Mercator-projected centroid, scales along local X/Y, re-rotates, and projects Mercator-y back to lat at the boundary. Doing the scale in Mercator (rather than raw lat/lon) keeps the polygon aligned with the Mercator-true bounding box `vertex-bbox-math` produces and matches the projection deck.gl renders into — same convention as `RectangleScaleMode` and `EllipseScaleMode`. Falls back to the parent's world-axis behavior when the angle is zero or `lockScaling` is true (uniform scale is rotation-invariant).

### RotateModeWithSnap

Extends `RotateMode` to support snapping to 45° intervals.

- **Default**: Free rotation.
- **With Shift (`snapRotation`)**: Snap to 45° intervals (0°, 45°, 90°, ...).

## Composite Modes

### BaseTransformMode

Abstract base class that extracts common patterns from the composite transform modes:

- Active mode tracking during drag operations
- Cursor aggregation from child modes
- Pick-based mode selection at drag start (using `HandleMatcher` pattern)
- Shift key modifier handling for scale/rotate operations
- Clean state reset on drag stop
- Pick filtering to prevent TypeError from sublayer elements without geometry

Subclasses define:

- `getHandleMatchers()`: Declarative mapping of picks to modes.
- `getDefaultMode()`: Mode to use when no handle is matched (typically `TranslateMode`).
- `onDragging()`: Optional hook for tooltips or other side effects.

### CircleTransformMode

For circle shapes. Combines:

- `ResizeCircleMode`: Drag edge to resize from center.
- `TranslateMode`: Drag body to move.

Shows live radius/area tooltip during resize.

### BoundingTransformMode

Generic axis-bounded fallback. Combines:

- `ScaleModeWithFreeTransform`: Drag corner handles to resize.
- `RotateModeWithSnap`: Drag top handle to rotate.
- `TranslateMode`: Drag body to move.

Most shapes use a more specific composite mode (rectangle, ellipse, vertex). Kept as a generic fallback for shape types that don't need rotation-aware scale math.

### LockedBoundingTransformMode

Same composition as `BoundingTransformMode` but locks scaling to uniform (preserves aspect ratio). Used for wagon-wheel shapes whose semantics require uniform scaling.

### RectangleTransformMode

For rectangles. Mirrors `BoundingTransformMode` but uses `RectangleScaleMode` in place of `ScaleModeWithFreeTransform` so a rotated rectangle stays a rectangle through scale. The rotate handle locks to the most-northern edge midpoint at edit-session start and stays attached to that shape-local point through every subsequent gesture. Shows live dimension/area tooltips during scaling.

### EllipseTransformMode

For ellipses. Mirrors `BoundingTransformMode` but uses `EllipseScaleMode` so a rotated ellipse stays an ellipse through scale. The rotate handle locks to the most-northern axis endpoint at edit-session start. Shows live dimension/area tooltips during scaling.

### VertexTransformMode

For shapes supporting vertex editing (polygons, lines). Combines:

- `ModifyMode`: Drag vertices to reshape.
- `OrientedScaleMode`: Drag corner handles to resize (local-frame when rotated).
- `RotateModeWithSnap`: Drag top handle to rotate.
- `TranslateMode`: Drag body to move.

Polygons and lines have no persisted rotation angle, so `VertexTransformMode` accumulates rotation deltas across the edit session in an `OrientationLock` (see `utils/orientation-lock.ts`). The accumulated angle drives the oriented bounding box rendered around the shape and the local-frame scaling done by `OrientedScaleMode`.

Does not show measurement tooltips because arbitrary polygons don't have meaningful dimensions.

### PointTranslateMode

For point shapes. Extends `GeoJsonEditMode` directly (not `BaseTransformMode`) to support both:

- **Click to place**: Click anywhere on the map to instantly move the point.
- **Drag**: Traditional drag behavior (delegated to `TranslateMode`).

This provides a better UX for points since they have a very small surface area for clicking.

## Orientation Lock (polygons / lines)

`OrientationLock` (in `utils/orientation-lock.ts`) is a per-session state machine owned by `VertexTransformMode`. It tracks two things across an edit session:

1. **Cumulative session rotation angle.** `RotateMode` reports `rotationAngle` as a per-drag transient — present during the drag, deleted on completion. The lock detects the set→unset transition, commits the last seen delta to a running total, normalizes to `[0, 360)`, and pipes the cumulative angle into `modeConfig.bboxOrientationAngle` so `OrientedScaleMode` can read it.

2. **Scale-drag oriented-bounding-box snapshot.** At the start of a scale drag, the lock snapshots the oriented bounding box. The snapshot is used to patch `ScaleMode`'s private `_cornerGuidePoints` so the scale-origin lookup anchors at a fixed world position even as the polygon's centroid drifts under non-uniform scaling. Without the snapshot, the origin drifts each frame and the scale formula explodes.

Internally composed of three primitives:

- `SessionCache<T>` — shape-id-keyed value cache; re-seeds on shape change. Lives in `utils/session-cache.ts` and is also used directly by `EllipseTransformMode` (for the locked axis-endpoint index) and `RectangleTransformMode` (for the locked edge index).
- `TransientLock<T>` — snapshot-on-enter / clear-on-exit for the scale drag. Module-private to `orientation-lock.ts`.
- `TransitionDetector<T>` — set→unset edge detection for the deck.gl transient rotation property. Module-private to `orientation-lock.ts`.

The lock is **generic over the bounding-box type** so its boundary tests can use a sentinel value instead of constructing a real `OrientedBoundingBox`.

## Mode Selection

`EditShapeLayer` automatically selects the appropriate mode based on shape type (see `store.ts` → `getEditModeForShape`):

| Shape Type | Edit Mode                    |
| ---------- | ---------------------------- |
| Point      | `point-translate`            |
| Circle     | `circle-transform`           |
| WagonWheel | `locked-bounding-transform`  |
| Rectangle  | `rectangle-transform`        |
| Ellipse    | `ellipse-transform`          |
| Polygon    | `vertex-transform`           |
| LineString | `vertex-transform`           |

## HandleMatcher Pattern

`BaseTransformMode` uses declarative handle matchers to determine which child mode handles a drag operation:

```typescript
protected override getHandleMatchers(): HandleMatcher[] {
  return [
    {
      // Scale handle: corner handles on bounding box
      match: (pick) => Boolean(
        pick.isGuide && pick.object?.properties?.editHandleType === 'scale'
      ),
      mode: this.scaleMode,
      shiftConfig: { configKey: 'lockScaling' },
    },
    {
      // Rotate handle: top handle on bounding box
      match: (pick) => Boolean(
        pick.isGuide && pick.object?.properties?.editHandleType === 'rotate'
      ),
      mode: this.rotateMode,
      shiftConfig: { configKey: 'snapRotation' },
    },
  ];
}
```

The first matcher that matches any pick wins. If no matcher matches, `getDefaultMode()` is used (typically `TranslateMode`).

## Shift Key Modifiers

| Mode                                            | Shift Behavior                            |
| ----------------------------------------------- | ----------------------------------------- |
| ScaleModeWithFreeTransform / OrientedScaleMode  | Uniform scaling (maintains aspect ratio)  |
| RectangleScaleMode                              | Uniform scaling                           |
| EllipseScaleMode                                | Uniform scaling                           |
| RotateModeWithSnap                              | Snap to 45° intervals                     |
| ModifyMode                                      | (no modifier)                             |
| ResizeCircleMode                                | (no modifier)                             |
| TranslateMode                                   | (no modifier)                             |

## Coupling to `@deck.gl-community/editable-layers`

The oriented-scale and oriented-bounding-box code reaches into `ScaleMode`'s private fields (`_isScaling`, `_cornerGuidePoints`, `_selectedEditHandle`, `_geometryBeingScaled`, `_getOppositeScaleHandle`, `_getUpdatedData`, `_cursor`) to keep the scale origin stable through a rotated drag. The cast boundary is centralized in `utils/scale-mode-internals.ts` (`scaleModePrivate(mode)` returns a typed view), but the field names are pinned to the current upstream internals. If `@deck.gl-community/editable-layers` renames or removes any of these, the oriented scaling features break silently — TypeScript can't help because the contract is defined locally. Treat any minor-version bump of that dependency as a behavioral regression risk and verify polygon/line rotate+scale manually.
