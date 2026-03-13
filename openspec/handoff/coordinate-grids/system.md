## Module Structure

```
src/libs/grids/
├── types/
│   └── types.ts                    — Public types: CellEntry, CellPolygon, GridStyleConfig,
│                                     MGRSLayerProps, GARSLayerProps
├── styles/
│   └── styles.ts                   — DEFAULT_STYLES: per-precision-level style constants
├── utils/
│   └── viewport-utils.ts           — getViewportBounds(): Deck.gl Viewport → ngageoint Bounds
├── stores/
│   ├── grid-store.ts               — Zustand store: activeGridType, showLabels
│   └── selection-store.ts          — Zustand store: hoveredCell, selectedCells, selectionEnabled
├── mgrs/
│   ├── mgrs-layer.ts               — MGRSLayer: CompositeLayer rendering MGRS grid
│   └── mgrs-helpers.ts             — getZoneData(): zone → { lines, labels } for one GridType
├── gars/
│   ├── gars-layer.ts               — GARSLayer: CompositeLayer rendering GARS grid
│   └── gars-helpers.ts             — getGridData(): bounds → { lines, labels } for one GridType
└── layers/
    ├── grid-layers.tsx             — GridLayers: React component, reads stores, renders active layer
    ├── grid-selection-overlay-layer.ts — SelectionOverlayLayer: renders hover + selected polygons
    └── side-effect.ts              — Layer class registration (app-specific Deck.gl wiring)
```

---

## Data Flow

### Grid rendering path

```
Map viewport changes (pan / zoom)
         │
         ▼
  Deck.gl calls shouldUpdateState()
  ┌─────────────────────────────────┐
  │ changeFlags.viewportChanged     │  → true → proceed
  │ changeFlags.propsChanged        │  → true → proceed
  └─────────────────────────────────┘
         │
         ▼
  Deck.gl calls renderLayers()
         │
         ├── viewport.zoom → Math.floor(zoom)
         │
         ├── getViewportBounds(viewport)
         │     └── returns ngageoint Bounds or null
         │
         ├── [MGRS only] GridZones.getGridRange(bounds) → zone iterator
         │
         └── for each entry in GRID_ZOOM_RANGES:
               │
               ├── skip if zoom < minZoom or zoom > maxZoom
               │
               ├── this.grids.getGrid(type) → Grid instance
               │
               ├── [MGRS] for each zone: getZoneData(grid, zone, bounds, zoom, type, showLabels)
               │   [GARS] getGridData(grid, bounds, zoom, type, showLabels)
               │     └── returns { lines: LineData[], labels: LabelData[] }
               │
               ├── new PathLayer({ data: lines, ... })
               └── new TextLayer({ data: labels, ... })  ← only if showLabels && labels.length > 0

        All PathLayers + TextLayers returned as flat array
        (fine precision first → coarse precision last → coarse renders on top)
```

### Selection rendering path

```
User interaction (hover / click)
         │
         ▼
  [App-level pick handler]
  sets hoveredCell / selectedCells in selection-store.ts
         │
         ▼
  GridLayers (React) reads stores via useSelectionStore
         │
         ▼
  SelectionOverlayLayer receives hoveredCell + selectedCells as props
         │
         ▼
  renderLayers() builds OverlayDatum[]
  ├── selectedCells.values() → each cell → { polygon, type: 'selected' }
  └── hoveredCell (if not in selectedCells) → { polygon, type: 'hovered' }
         │
         ▼
  Single PolygonLayer with getFillColor / getLineColor keyed on datum.type
  ├── 'hovered'  → white translucent fill  [255, 255, 255, 60]
  └── 'selected' → blue translucent fill   [59, 130, 246, 80]
```

### Grid type switching path

```
User toggles grid type (toolbar / settings)
         │
         ▼
  gridStore.toggleGrid(type) or setActiveGridType(type)
         │
         ▼
  GridLayers re-renders (useGridStore subscription)
         │
         ├── activeGridType === 'mgrs' → render <mgrsLayer> + <selectionOverlayLayerClass>
         ├── activeGridType === 'gars' → render <garsLayer> + <selectionOverlayLayerClass>
         └── activeGridType === null   → render null
```

---

## Rendering Pipeline

### MGRSLayer (`mgrs-layer.ts`)

Extends `CompositeLayer<MGRSLayerProps>`.

**State initialization** (`initializeState`):
- Creates a single `Grids` instance via `Grids.create()` and stores it on the class.
- `Grids` is the mgrs-js entry point for accessing individual grid precision instances.

**Update check** (`shouldUpdateState`):
- Returns true if `viewportChanged` or `propsChanged`. Skips re-render otherwise.

**Layer production** (`renderLayers`):
- Reads `viewport` from `this.context` and floored zoom.
- Calls `getViewportBounds(viewport)` — returns null on failure, returns full-globe bounds if viewport is wider than world.
- Calls `GridZones.getGridRange(bounds)` to get the set of MGRS grid zones intersecting the current viewport.
- Iterates `GRID_ZOOM_RANGES` (ordered fine→coarse: KILOMETER, TEN_KILOMETER, HUNDRED_KILOMETER, GZD).
- For each in-range entry, calls `getZoneData()` for every zone, accumulating `lines` and `labels`.
- Produces one `PathLayer<LineData>` and one `TextLayer<LabelData>` per precision level.
- Returns flat array — Deck.gl renders in order, so GZD (last) draws on top.

**Style lookup** (`getStyle`):
- Maps `GridType` enum value → style key string → `DEFAULT_STYLES[key]`.
- Falls back to `DEFAULT_STYLES.GZD` if key is missing.

### GARSLayer (`gars-layer.ts`)

Structurally identical to `MGRSLayer`. Key differences:

- Uses `@ngageoint/gars-js` `Grids` and `GridType` (different enum values: THIRTY_MINUTE, FIFTEEN_MINUTE, FIVE_MINUTE).
- Does not use `GridZones` — GARS does not have the same zone concept as MGRS. Calls `getGridData(grid, bounds, zoom, type, showLabels)` directly (no zone iteration).
- `GRID_ZOOM_RANGES` uses non-overlapping ranges at lower zoom levels (see design.md Decisions).
- `PathLayer` does not set `wrapLongitude: true` (known gap — see design.md Tradeoffs).

### SelectionOverlayLayer (`grid-selection-overlay-layer.ts`)

Extends `CompositeLayer<SelectionOverlayLayerProps>`.

**No `initializeState` or `shouldUpdateState` overrides** — re-renders whenever props change (default behavior).

**Layer production** (`renderLayers`):
- Builds `OverlayDatum[]` from `selectedCells` (Map) and `hoveredCell`.
- Selected cells are added first; hoveredCell is appended only if not already in the selected set (checked via `selectedCells.has(hoveredCell.mgrsId)`).
- Returns empty array if no data.
- Produces a single `PolygonLayer<OverlayDatum>` with `getFillColor` and `getLineColor` keyed on `datum.type`.

---

## Key Algorithms

### Viewport bounds calculation (`viewport-utils.ts: getViewportBounds`)

Converts a Deck.gl `Viewport` to an ngageoint `Bounds` object. Two edge cases require special handling before the general case:

**Full-globe detection** (checked first):
```
worldPixelWidth = 512 × 2^zoom

if viewport.width >= worldPixelWidth:
  return Bounds(-180, -80, 180, 84)   ← hardcoded full extent
```
When the viewport is wider than one world, `unproject()` returns an incomplete longitude range. The check must use pixel width comparison, not coordinate comparison.

**General case — corner unprojection**:
```
nw = viewport.unproject([0, 0])                       ← top-left pixel
se = viewport.unproject([viewport.width, viewport.height])  ← bottom-right pixel
```

**Antimeridian crossing detection**:
```
if nw.lon > se.lon:
  # Crossing detected (e.g. nw=170, se=-170)
  minLon = nw.lon
  maxLon = se.lon + 360    ← normalize: 170 to 190

else:
  minLon = min(nw.lon, se.lon)
  maxLon = max(nw.lon, se.lon)
```

**Post-normalization clamp** (catches denormalized or wrapped cases):
```
if minLon < -180 or maxLon > 180 or (maxLon - minLon) >= 360:
  minLon = -180
  maxLon = 180
```

**Latitude clamp** (MGRS valid range):
```
minLat = max(-80, min(nw.lat, se.lat))
maxLat = min(84, max(nw.lat, se.lat))
```

### Zoom range filtering and draw order

`GRID_ZOOM_RANGES` is a static array defined at module level, ordered fine→coarse:

```typescript
// MGRS
{ type: GridType.KILOMETER,          minZoom: 11, maxZoom: 20 }
{ type: GridType.TEN_KILOMETER,      minZoom: 8,  maxZoom: 20, labelMinZoom: 10 }
{ type: GridType.HUNDRED_KILOMETER,  minZoom: 4,  maxZoom: 20 }
{ type: GridType.GZD,                minZoom: 0,  maxZoom: 20 }

// GARS
{ type: GridType.FIVE_MINUTE,        minZoom: 12, maxZoom: 20, labelMinZoom: 12 }
{ type: GridType.FIFTEEN_MINUTE,     minZoom: 8,  maxZoom: 12, labelMinZoom: 9 }
{ type: GridType.THIRTY_MINUTE,      minZoom: 6,  maxZoom: 8,  labelMinZoom: 4 }
```

Filtering in `renderLayers`:
```
for entry in GRID_ZOOM_RANGES:
  if zoom < entry.minZoom or zoom > entry.maxZoom:
    continue   ← skip this precision level entirely

  showLabelsForLevel = showLabels && zoom >= (entry.labelMinZoom ?? entry.minZoom)
```

The iteration order is what produces correct draw order — layers appended later in the returned array render on top in Deck.gl. Since GZD is last, it always renders over finer grids.

### `CellEntry` identity key

`SelectionOverlayLayer` uses `hoveredCell.mgrsId` (a string) as the identity key for deduplication checks. Note: this field is named `mgrsId` on `CellEntry` even for GARS cells — it holds whichever grid system's identifier string is appropriate (e.g. `"006AG39"` for GARS). This naming is an artifact of the feature's MGRS-first development history.
