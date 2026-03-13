## Proposed Types

```typescript
// The unit of selection — a single grid cell with its identifier,
// grid type, and polygon geometry.
interface CellEntry {
  /** MGRS or GARS identifier string (e.g. "33TWL" or "006AG39") */
  id: string;
  /** Which grid system this cell belongs to */
  gridSystem: 'mgrs' | 'gars';
  /** Closed ring of [lon, lat] coordinates */
  polygon: [number, number][];
}

// Style configuration for a single precision level.
// All fields optional — unset fields fall back to layer defaults.
interface GridLevelStyle {
  lineColor?: [number, number, number, number]; // RGBA
  lineWidth?: number;                           // pixels
  labelColor?: [number, number, number, number];
  labelSize?: number;                           // points
  labelBackgroundColor?: [number, number, number, number];
}
```

Note: `gridSystem` replaces the internal `gridType` enum (which came from `mgrs-js`). The library should use its own string union, not re-export an enum from a dependency.

---

## Proposed Layer / Component API

### MGRSLayer

```typescript
interface MGRSLayerProps extends CompositeLayerProps {
  showLabels?: boolean;              // default: true
  gzdStyle?: GridLevelStyle;
  hundredKmStyle?: GridLevelStyle;
  tenKmStyle?: GridLevelStyle;
  kilometerStyle?: GridLevelStyle;
}
```

### GARSLayer

```typescript
interface GARSLayerProps extends CompositeLayerProps {
  showLabels?: boolean;              // default: true
  thirtyMinuteStyle?: GridLevelStyle;
  fifteenMinuteStyle?: GridLevelStyle;
  fiveMinuteStyle?: GridLevelStyle;
}
```

### SelectionOverlayLayer

```typescript
interface SelectionOverlayLayerProps extends CompositeLayerProps {
  hoveredCell?: CellEntry | null;
  selectedCells?: CellEntry[];
}
```

**Example usage** — consumer composes layers directly, owns all state:

```typescript
// In the consumer's Deck.gl layers array:
new MGRSLayer({
  id: 'mgrs-grid',
  showLabels: true,
  gzdStyle: { lineWidth: 6 },
}),
new SelectionOverlayLayer({
  id: 'grid-selection',
  hoveredCell: myHoveredCell,
  selectedCells: mySelectedCells,
}),
```

---

## Proposed Exports

```typescript
// Layer classes (primary exports)
export { MGRSLayer } from './mgrs-layer';
export { GARSLayer } from './gars-layer';
export { SelectionOverlayLayer } from './selection-overlay-layer';

// Types (consumer needs these to type their own state)
export type { MGRSLayerProps } from './mgrs-layer';
export type { GARSLayerProps } from './gars-layer';
export type { SelectionOverlayLayerProps } from './selection-overlay-layer';
export type { CellEntry, GridLevelStyle } from './types';
```

Peer dependencies to declare in `package.json`:
- `@deck.gl/core`
- `@deck.gl/layers`
- `react` (only if a React wrapper is included — see Open Questions)

---

## What NOT to Expose

**`GRID_ZOOM_RANGES`** — Internal constant that controls when each precision level renders. Consumers don't need to know zoom thresholds; they should trust the layer to manage them. Exposing this would invite consumers to override it in ways that break the visual hierarchy guarantees.

**`DEFAULT_STYLES`** — Internal defaults. Expose styling via props (`GridLevelStyle`) instead. Consumers can override any field; the rest fall back to defaults internally.

**`getViewportBounds`** — Internal utility used by `renderLayers`. The antimeridian and globe-wrap logic is critical but entirely internal to the layer lifecycle. Exposing it would imply a public contract that is difficult to maintain.

**`getZoneData` / `getGridData`** — Internal data generation functions from mgrs-helpers and gars-helpers. These are implementation details of how line and label data is produced. Not useful to consumers.

**`mgrs-js` / `gars-js` types** — Do not re-export `GridType` enum or other types from the NGA libraries. The library should own its own type vocabulary. If consumers need grid system types, use the `'mgrs' | 'gars'` string union from `CellEntry`.

---

## Open Questions for the Receiving Team

**1. Single package or two?**
This implementation has MGRS and GARS as sibling modules that share types, styles, and viewport utilities. Should the library ship as a single `@org/coordinate-grids` package with both, or as separate `@org/mgrs-layer` and `@org/gars-layer` packages? The shared `CellEntry` type and `SelectionOverlayLayer` complicate splitting — if split, where do shared types live?

**2. Controlled vs. uncontrolled selection state**
In this application, selection state (hover + selected cells) lives in Zustand and is passed to `SelectionOverlayLayer` from outside. Should the library support an uncontrolled mode where it manages selection state internally (e.g. with an `onCellHover` / `onCellClick` callback that the layer handles), or should it be fully controlled (consumer always owns state)? A fully controlled API is simpler to implement but requires the consumer to wire up Deck.gl pick events themselves.

**3. React wrapper layer?**
The application ships a `GridLayers` React component that reads from Zustand. The library probably should not — but should it offer any React-specific helpers (hooks, context) to make wiring up state easier for React consumers? Or is the raw Deck.gl layer API sufficient?

**4. Finer MGRS precision levels**
The application stops at 1km. The `mgrs-js` library supports 100m, 10m, and 1m. Should the library expose props for these finer levels (e.g. `hundredMeterStyle`) even if they are disabled by default? Adding them later would be non-breaking if the props are optional, but the zoom range decisions are non-trivial (see Callout: Zoom Range Override).

**5. GARS antimeridian handling**
The application's GARS `PathLayer` does not set `wrapLongitude: true` (unlike MGRS). Is this a known limitation to carry forward, or should the library fix it? Requires verifying whether `gars-js` cell polygons need longitude normalization before Deck.gl renders them correctly near the antimeridian.
