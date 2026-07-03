---
"@accelint/map-toolkit": minor
---

- Add bearing/distance measurement tools: `MeasurementLayer`, `useMeasurement`, and `MeasurementTool`.
- **`MeasurementLayer`** is a deck.gl `CompositeLayer` that renders a dashed line with circular endpoints and an optional text label.
- **`useMeasurement(mapId?, requiresModifier?)`** is a React hook that subscribes to `map:dragStart`, `map:drag`, and `map:dragEnd` bus events to track a measurement drag. Returns `{ isMeasuring, pointA, pointB, distanceKm, distanceNM, bearingDeg, start, clear }`. Suppresses map pan during active measurement via `map:disablePan` / `map:enablePan`.
- **`MeasurementTool`** is a convenience component that composes the hook and layer. Drop `<MeasurementTool />` inside a `<BaseMap>` to add drag-to-measure functionality with zero additional wiring. Supports `requiresModifier` (`'shift'` | `'ctrl'` | `'alt'`) to allow plain drag to continue panning while a modifier key activates measurement.
- Adds `dragStart`, `drag`, and `dragEnd` events to `MapEvents` and `BaseMap`, enabling the bus-driven drag event subscription pattern used by the hook.
- Fiber registration (`import '@accelint/map-toolkit/deckgl/measurement-layer/fiber'`) enables JSX usage: `<measurementLayer pointA={…} pointB={…} />`.
