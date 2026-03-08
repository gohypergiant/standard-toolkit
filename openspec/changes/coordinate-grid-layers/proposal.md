## Why

Grid visualization capabilities (GARS, MGRS, and future systems like UTM, H3, S2) are valuable across multiple projects in the standard-toolkit ecosystem. Building these as standalone, reusable deck.gl layers in `@accelint/map-toolkit` will enable any project to add grid visualization while following established patterns from existing map-toolkit layers (text-layer, symbol-layer, shapes).

## What Changes

- Build `GARSLayer` and `MGRSLayer` deck.gl composite layers in map-toolkit
- Create declarative architecture with shared `BaseGridLayer` to eliminate duplication across grid systems
- Create shared utilities for viewport bounds calculation and geometry generation
- Implement automatic event bus integration using `@accelint/bus` for grid interactions (hover, click, selection)
- Add configurable zoom range system with sensible defaults
- Provide flexible styling API with per-grid-type overrides
- Create React Fiber bindings for JSX usage
- Add comprehensive TypeScript types and documentation (MDX + Storybook)
- Update map-toolkit package.json with granular exports for grid layers
- Add `@ngageoint/gars-js` and `@ngageoint/mgrs-js` as optional dependencies

## Scope Reduction from Reference

The reference implementation includes a `SelectionOverlayLayer` for rendering hover highlight and multi-cell selection polygons, driven by Zustand stores. **This library defers `SelectionOverlayLayer` to a future version.**

Rationale: The reference selection overlay is tightly coupled to application state (`hoveredCell`, `selectedCells` in Zustand). Decoupling it for library use requires designing a fully controlled props API for selection state. That design adds scope beyond what's needed to validate the core grid rendering architecture. Consumers needing selection overlay in v1 can render their own `PolygonLayer` using `CellEntry` polygon data.

The handoff callout `[selectionEnabled Flag]` is noted but not implemented in v1 as a result.

## Capabilities

### New Capabilities

- `gars-grid-layer`: GARS (Global Area Reference System) deck.gl layer with multi-precision grid rendering (30-minute, 15-minute, 5-minute cells), label support, and customizable styling
- `mgrs-grid-layer`: MGRS (Military Grid Reference System) deck.gl layer with zone-based rendering (GZD, 100km, 10km, 1km grids), label support, and customizable styling
- `grid-event-integration`: Event bus integration for grid layer interactions using `@accelint/bus`, emitting events for hover, click, and selection with map instance ID support
- `grid-zoom-configuration`: Configurable zoom range system allowing users to customize min/max zoom levels per grid type with sensible defaults
- `grid-styling-api`: Flexible styling API supporting per-grid-type style overrides with partial merging of line colors, widths, label styling, and background colors

### Modified Capabilities

<!-- No existing capabilities are being modified -->

## Impact

### Code Changes
- **map-toolkit**: New `src/deckgl/grid-layers/` directory with GARS, MGRS, and shared utilities
- **map-toolkit**: Updated `package.json` with new exports and optional dependencies

### Dependencies
- Adds `@ngageoint/gars-js` and `@ngageoint/mgrs-js` as optional dependencies to map-toolkit
- Projects using grid layers will need to install map-toolkit with the optional grid library dependencies

### APIs
- New public API surface in map-toolkit for grid layers with TypeScript types
- Event bus events emitted for grid interactions following `@accelint/bus` patterns
- No breaking changes to existing map-toolkit APIs

### Other Systems
- Enables any project in standard-toolkit ecosystem to adopt grid visualization capabilities
- Storybook documentation added to map-toolkit for grid layers
- Extensible architecture makes adding new grid systems (UTM, H3, S2) straightforward