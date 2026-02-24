---
"@accelint/map-toolkit": major
---

Add `enableElevation` prop to DisplayShapeLayer for 3D shapes rendering.

Remove `showHighlight` and `highlightColor` props — selection feedback is now purely additive and not customizable at the layer level.

Remove dotted border treatment on shape selection — interactions no longer modify a shape's innate styling.

Apply material-based brightness effect for hover and selection on all polygon shapes. All shapes brighten their outline color on hover or select (1.4×), with an even brighter combined state when both active (1.7×).

## Breaking Changes

### `showHighlight` removed

This prop previously defaulted to `false` and required opt-in to show a selection highlight. Selection feedback is now always active when `selectedShapeId` is set.

**Before:**

```tsx
<DisplayShapeLayer showHighlight={true} selectedShapeId={id} />
```

**After:**

```tsx
<DisplayShapeLayer selectedShapeId={id} />
```

Remove any `showHighlight` prop usage. If you were relying on `showHighlight={false}` to suppress the highlight, there is no replacement — selection overlays are always rendered.

### `highlightColor` removed

This prop previously allowed customizing the selection highlight color. Highlight color is no longer configurable at the layer level.

**Before:**

```tsx
<DisplayShapeLayer highlightColor={[255, 100, 0, 255]} selectedShapeId={id} />
```

**After:**

```tsx
<DisplayShapeLayer selectedShapeId={id} />
```

Remove any `highlightColor` prop usage. Selection brightness is now driven entirely by material-based lighting.
