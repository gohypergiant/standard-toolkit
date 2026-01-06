---
"@accelint/map-toolkit": minor
---

Add EditShapeLayer for interactive shape editing

**New features:**

- `EditShapeLayer` component for editing existing shapes on the map
- `useEditShape` hook for managing edit state with `edit()`, `save()`, and `cancel()` controls
- Support for all shape types: Point, LineString, Polygon, Rectangle, Circle, and Ellipse
- Live measurement tooltips during editing (dimensions and area)
- Shift key modifiers: hold for uniform scaling or 45° rotation snapping
- ESC key to cancel editing
- Locked shape support (`shape.locked` prevents editing)

**Bug fixes:**

- Add `boxZoom` to disabled controls list when Shift key is used for shape operations (prevents map zoom interference)

**Internal improvements:**

- Consolidate tooltip calculation logic into shared geometry measurement utilities
- Standardize `mapId` optionality across hooks (optional with context fallback)
- Add documentation for modes architecture (README.md in modes directory)
- Rename `strokeColor` to `lineColor` and `strokeWidth` to `lineWidth` in style properties to align with deck.gl conventions
- Rename `shapeType` to `shape` in Shape type for consistency with deck.gl
