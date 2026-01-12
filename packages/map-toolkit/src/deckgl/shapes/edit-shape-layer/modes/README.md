# Edit Shape Layer Modes

This directory contains the edit modes used by `EditShapeLayer` for transforming shapes on the map.

## Architecture Overview

The modes follow a **leaf mode / composite mode** pattern from `@deck.gl-community/editable-layers`:

- **Leaf modes**: Handle a single type of operation (scale, rotate, translate, modify, resize)
- **Composite modes**: Combine multiple leaf modes and delegate based on what's being dragged

```
@deck.gl-community/editable-layers
├── ScaleMode (leaf)
├── RotateMode (leaf)
├── TranslateMode (leaf)
├── ModifyMode (leaf)
├── ResizeCircleMode (leaf)
└── CompositeMode (composite base)

map-toolkit/edit-shape-layer/modes
├── ScaleModeWithFreeTransform extends ScaleMode (leaf)
├── RotateModeWithSnap extends RotateMode (leaf)
├── BaseTransformMode extends CompositeMode (composite base)
│   ├── CircleTransformMode extends BaseTransformMode
│   ├── BoundingTransformMode extends BaseTransformMode
│   └── VertexTransformMode extends BaseTransformMode
```

## Leaf Modes

### ScaleModeWithFreeTransform

Extends `ScaleMode` to support non-uniform (free) scaling.

- **Default**: Free scaling - can stretch/squish in any direction
- **With Shift (lockScaling)**: Uniform scaling - maintains aspect ratio

The parent `ScaleMode` only supports uniform scaling. This extension calculates separate X/Y scale factors based on cursor movement relative to the opposite corner anchor point.

### RotateModeWithSnap

Extends `RotateMode` to support snapping to 45° intervals.

- **Default**: Free rotation
- **With Shift (snapRotation)**: Snap to 45° intervals (0°, 45°, 90°, etc.)

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
- `getHandleMatchers()`: Declarative mapping of picks to modes
- `getDefaultMode()`: Mode to use when no handle is matched (typically TranslateMode)
- `onDragging()`: Optional hook for tooltips or other side effects

### CircleTransformMode

For circle shapes. Combines:
- `ResizeCircleMode`: Drag edge to resize from center
- `TranslateMode`: Drag body to move

Shows live diameter/area tooltip during resize.

### BoundingTransformMode

For shapes using bounding box manipulation (ellipses, rectangles). Combines:
- `ScaleModeWithFreeTransform`: Drag corner handles to resize
- `RotateModeWithSnap`: Drag top handle to rotate
- `TranslateMode`: Drag body to move

Shows live dimension/area tooltips during scaling.

### VertexTransformMode

For shapes supporting vertex editing (polygons, lines). Combines:
- `ModifyMode`: Drag vertices to reshape
- `ScaleModeWithFreeTransform`: Drag corner handles to resize
- `RotateModeWithSnap`: Drag top handle to rotate
- `TranslateMode`: Drag body to move

Note: Does not show tooltips because arbitrary polygons don't have meaningful dimensions.

## Mode Selection

The `EditShapeLayer` automatically selects the appropriate mode based on shape type:

| Shape Type | Edit Mode |
|------------|-----------|
| Circle | `circle-transform` |
| Ellipse | `bounding-transform` |
| Rectangle | `bounding-transform` |
| Polygon | `vertex-transform` |
| LineString | `vertex-transform` |
| Point | `translate` |

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

| Mode | Shift Behavior |
|------|----------------|
| ScaleModeWithFreeTransform | Uniform scaling (maintains aspect ratio) |
| RotateModeWithSnap | Snap to 45° intervals |
| ModifyMode | (no modifier) |
| ResizeCircleMode | (no modifier) |
| TranslateMode | (no modifier) |
