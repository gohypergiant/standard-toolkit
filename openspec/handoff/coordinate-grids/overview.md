## What This Is

The coordinate grids capability renders military coordinate reference grids (MGRS and GARS) as Deck.gl layers on a Maplibre map. It provides zoom-adaptive grid lines and labels for both systems, along with interactive cell hover and multi-select. It is used by operators in the application to orient on the map and select grid cells for tasking.

## Problem It Solves

Military operations require spatial reference using standard grid systems (MGRS and GARS) rather than arbitrary lat/lon. No off-the-shelf Deck.gl layer existed for these systems with the right zoom-adaptive behavior, antimeridian handling, or selection interaction required for a C2 application. The feature was built to integrate the NGA-maintained `mgrs-js` and `gars-js` libraries into Deck.gl's rendering pipeline with application-appropriate behavior.

## Key Dependencies

### Required
- `@ngageoint/mgrs-js` — MGRS grid computation (zone data, grid types, bounds intersection)
- `@ngageoint/gars-js` — GARS grid computation (30/15/5-minute cell data)
- `@ngageoint/grid-js` — Shared `Bounds` and `Unit` types used by both grid libraries

### Peer
- `@deck.gl/core` — `CompositeLayer`, `Viewport`, `UpdateParameters`, `Color`
- `@deck.gl/layers` — `PathLayer`, `TextLayer`, `PolygonLayer`
- React — `GridLayers` orchestrator is a React component using hooks

### Internal
- `stores/grid-store.ts` — Zustand store for `activeGridType` (`'mgrs' | 'gars' | null`) and `showLabels`
- `stores/selection-store.ts` — Zustand store for `hoveredCell`, `selectedCells`, and `selectionEnabled`
- `layers/side-effect.ts` — Layer registration side effect (app-specific Deck.gl wiring)

## Scope Boundaries

### In Scope
- Rendering MGRS grid lines and labels at four precision levels (GZD, 100km, 10km, 1km)
- Rendering GARS grid lines and labels at three precision levels (30min, 15min, 5min)
- Zoom-adaptive visibility: each precision level appears only within its configured zoom range
- Viewport bounds calculation with antimeridian crossing and full-globe detection
- Cell hover highlight and multi-cell selection overlay (via `SelectionOverlayLayer`)
- Per-precision-level style configuration (line color, line width, label color, label size, background)
- Toggle between MGRS, GARS, or no grid
- Toggle label visibility

### Out of Scope
- Grid cell coordinate parsing or geocoding (e.g. "what MGRS cell is this point in?")
- Grid cell export or clipboard operations
- Grids other than MGRS and GARS
- MGRS precision finer than 1km (100m, 10m, 1m grid types exist in mgrs-js but are not rendered)
- Persistence of selected cells across sessions
