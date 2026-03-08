## Decisions

### Overlapping zoom ranges for MGRS
**Chosen**: MGRS precision levels use overlapping zoom ranges so coarser grids (GZD, 100km) remain visible at higher zoom levels alongside finer grids.
**Why**: Operators need to orient using coarser reference grids even when working at fine precision. If a 1km grid is visible, the GZD zone boundary must still be visible for context.
**Alternatives considered**: The `mgrs-js` library ships a default config (`mgrs.json`) with non-overlapping ranges. This was explicitly overridden because non-overlapping ranges cause coarser grids to disappear at higher zoom levels, which breaks operator orientation.

### GARS uses mostly non-overlapping zoom ranges
**Chosen**: GARS precision levels use non-overlapping ranges at lower zoom levels, transitioning to a single active level per zoom band.
**Why**: GARS's three precision levels (30min, 15min, 5min) have distinct operational use cases. Showing all three simultaneously at mid-zoom produces visual noise without adding reference value — unlike MGRS where zone boundaries are always operationally relevant.
**Alternatives considered**: Fully overlapping ranges (like MGRS). Not chosen because GARS labels at all levels simultaneously become unreadable at mid-zoom.

### Separate PathLayer + TextLayer per precision level
**Chosen**: Each precision level gets its own `PathLayer` for lines and `TextLayer` for labels, rather than combining all lines into one layer.
**Why**: This gives explicit control over draw order. Layers later in the array render on top; by ordering fine-to-coarse in `GRID_ZOOM_RANGES`, coarser grid boundaries are always visually prominent. A single combined layer cannot achieve this ordering.
**Alternatives considered**: One PathLayer for all lines with color-coded data. Rejected because Deck.gl draw order within a single layer is data-order, not precision-order, making it unreliable for visual hierarchy.

### Grid state managed via Zustand stores
**Chosen**: `activeGridType`, `showLabels`, `hoveredCell`, and `selectedCells` are held in Zustand stores.
**Why**: These values are read by multiple components across the application (map layers, toolbar, settings panel). Zustand provides a shared, reactive source of truth without prop drilling.
**Alternatives considered**: Local component state or React context. Not suitable for state that must be accessible outside the React tree (e.g. by Deck.gl layer callbacks).

### `Grids` instance created in `initializeState`, not `renderLayers`
**Chosen**: The `mgrs-js` and `gars-js` `Grids` objects are created once in `initializeState()` and stored on the layer instance.
**Why**: `renderLayers()` is called on every viewport change. Constructing `Grids` on each render would be expensive and produce unnecessary garbage collection pressure.
**Alternatives considered**: Creating `Grids` inside `renderLayers`. Rejected due to performance cost at high frame rates.

### No picking on grid layers
**Chosen**: All grid line and label layers are created with `pickable: false`.
**Why**: Picking is handled by a separate `SelectionOverlayLayer` that works from a Zustand store. Grid lines are purely visual reference — enabling picking on them would interfere with underlying map interaction without adding value.
**Alternatives considered**: Pickable grid layers that trigger selection directly. Not chosen because it creates coupling between the rendering layer and selection logic, and makes it hard to distinguish grid picks from feature picks.

---

## Tradeoffs

- **MGRS precision floor is 1km.** The `mgrs-js` library supports 100m, 10m, and 1m grid types, but they are not rendered. At high zoom levels, 1km cells are already very small; finer grids would be visually unusable and computationally expensive for the viewport intersection math.

- **GARS zoom ranges leave gaps.** The transition between GARS precision levels is step-wise, not gradual. At the boundary between zoom bands (e.g. zoom 8 when transitioning from 15min to 30min), there is a discrete jump in grid density.

- **Selection state is not encoded in the grid layers.** `MGRSLayer` and `GARSLayer` have no awareness of hover or selection. All selection rendering goes through `SelectionOverlayLayer`. This keeps the grid layers pure but means the overlay must always be composed alongside the grid layer — they are not self-contained.

- **`wrapLongitude: true` only on MGRS PathLayer.** GARS `PathLayer` does not set `wrapLongitude`. This is a known gap — GARS lines near the antimeridian may not render correctly in all cases.

---

## Callouts

**[Zoom Range Override]**: The `mgrs-js` library has a built-in grid configuration in `mgrs.json` that defines non-overlapping zoom ranges. This implementation explicitly overrides those ranges via the `GRID_ZOOM_RANGES` constant. If the receiving team uses `Grids.create()` with library defaults and relies on its built-in zoom filtering, coarser grids will disappear at higher zoom levels. The zoom filtering MUST be done manually in `renderLayers()` using explicit min/max checks.

**[Antimeridian Detection]**: The viewport bounds calculation handles two distinct edge cases that require separate logic:
1. Antimeridian crossing — detected when the northwest corner longitude is greater than the southeast corner longitude (e.g. NW=170, SE=-170). Handled by adding 360 to normalize: 170 to 190.
2. Full-globe viewport — detected by comparing viewport pixel width to world pixel width (`512 × 2^zoom`). When true, unproject() returns partial bounds; bounds must be hardcoded to the full valid extent.
Missing either case produces invisible or clipped grids at the affected viewport positions.

**[Draw Order is Intentional]**: `GRID_ZOOM_RANGES` is ordered finest-to-coarsest. Deck.gl renders layers in array order, so entries later in the array render on top. Reversing this order (coarse-to-fine) will make coarser grid lines invisible behind finer ones — a subtle visual bug with no error.

**[Label Minimum Zoom]**: Labels have a separate `labelMinZoom` threshold distinct from the line `minZoom`. A precision level can be rendering lines before its labels appear (e.g. 10km lines at zoom 8, labels only at zoom 10). If the receiving team conflates these, labels will appear too early and produce visual noise.

**[`selectionEnabled` Flag]**: The selection store has a `selectionEnabled` flag that gates whether hover/selection interaction is active. `SelectionOverlayLayer` does not check this flag — it renders whatever `hoveredCell` and `selectedCells` contain. The enabling/disabling logic must be enforced upstream by whatever drives the store. A library implementation should decide whether to expose this as a prop or leave it to the consumer.

---

## Application Specific Concerns

**Grid type switching (Zustand → prop)**
- Coupled to: `grid-store.ts` (`activeGridType`)
- Coupling type: Zustand store import, read inside `GridLayers` React component
- Library should: Accept `gridType: 'mgrs' | 'gars' | null` as a prop. Consumers control which layer to render; the library does not need to manage this state.

**Label visibility (Zustand → prop)**
- Coupled to: `grid-store.ts` (`showLabels`)
- Coupling type: Zustand store import
- Library should: Accept `showLabels: boolean` as a prop on `MGRSLayer` and `GARSLayer` (already present as `MGRSLayerProps` / `GARSLayerProps` — this is the direction to take in library form).

**Selection state (Zustand → props)**
- Coupled to: `selection-store.ts` (`hoveredCell`, `selectedCells`)
- Coupling type: Zustand store import inside `GridLayers`
- Library should: Accept `hoveredCell: CellEntry | null` and `selectedCells: CellEntry[]` (or `Map`) as props on `SelectionOverlayLayer`. The consumer owns selection state. The library should expose the `CellEntry` type so consumers can build their own selection logic.

**Layer registration side effect**
- Coupled to: `layers/side-effect.ts` (app-specific Deck.gl layer registration)
- Coupling type: Side-effect import in `GridLayers`
- Library should: Handle layer class registration internally (or document the requirement clearly if the consumer's Deck.gl version differs).

**`GridLayers` React component**
- Coupled to: React, both Zustand stores, the side-effect import
- Coupling type: React component with hard-coded store reads
- Library should: Not ship a `GridLayers` orchestrator component. Consumers compose `MGRSLayer`, `GARSLayer`, and `SelectionOverlayLayer` directly in their own Deck.gl layer list. The library's public surface is the layer classes, not a React wrapper.
