---
"@accelint/map-toolkit": minor
---

Add DrawShapeLayer for interactive shape drawing

**New features:**

- `DrawShapeLayer` component for drawing shapes on the map
- `useDrawShape` hook for managing drawing state with `draw()` and `cancel()` controls
- Support for multiple geometry types: Point, LineString, Polygon, Rectangle, Circle, and Ellipse
- Real-time tooltips showing distance/area measurements during drawing
- Protected drawing mode (cannot be interrupted by other map mode requests)
- Double-click to finish polygons and lines
- Shift-to-square constraint when drawing rectangles
- Custom styling support (fill/line colors) when initiating drawing
- ESC key to cancel drawing

**Internal improvements:**

- Refactor viewport to use shared unit abbreviation map from `shared/units.ts`
