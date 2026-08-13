## Purpose

Defines requirements for the coordinate grid layer system in `@accelint/map-toolkit`. Provides `GARSLayer` and `MGRSLayer` as standalone deck.gl layers built on a shared `BaseGridLayer` abstraction. Covers rendering, zoom configuration, styling, and event bus integration.

## Requirements

### Requirement: GARS layer renders grid lines at appropriate zoom levels
The GARSLayer SHALL render GARS grid lines at three precision levels based on viewport zoom: 30-minute cells (coarsest), 15-minute cells (medium), and 5-minute cells (finest). Each precision level SHALL have configurable minimum and maximum zoom thresholds to control visibility.

#### Scenario: Rendering 30-minute grid
- **WHEN** the viewport zoom level is within the configured range for 30-minute grids (default minZoom: 4, maxZoom: 20, labelMinZoom: 6)
- **THEN** the layer renders 30-minute GARS cell boundaries as PathLayer lines

#### Scenario: Rendering 15-minute grid
- **WHEN** the viewport zoom level is within the configured range for 15-minute grids (default minZoom: 8, maxZoom: 18, labelMinZoom: 8)
- **THEN** the layer renders 15-minute GARS cell boundaries as PathLayer lines

#### Scenario: Rendering 5-minute grid
- **WHEN** the viewport zoom level is within the configured range for 5-minute grids (default minZoom: 11, maxZoom: 20, labelMinZoom: 11)
- **THEN** the layer renders 5-minute GARS cell boundaries as PathLayer lines

#### Scenario: No rendering outside zoom range
- **WHEN** the viewport zoom level is outside the configured range for all grid types
- **THEN** the layer renders no grid lines

### Requirement: MGRS layer renders grid lines at appropriate zoom levels
The MGRSLayer SHALL render MGRS grid lines at four precision levels: GZD (Grid Zone Designator), 100km grids, 10km grids, and 1km grids. Each precision level SHALL have configurable zoom thresholds and coarser levels SHALL remain visible at higher zoom for operator orientation.

#### Scenario: Rendering GZD at all zoom levels
- **WHEN** the viewport zoom level is within the configured range for GZD (default 3-20)
- **THEN** the layer renders GZD boundaries as PathLayer lines

#### Scenario: Rendering 100km grid
- **WHEN** the viewport zoom level is within the configured range for 100km grids (default 5-20)
- **THEN** the layer renders 100km grid boundaries as PathLayer lines

#### Scenario: Rendering 10km grid
- **WHEN** the viewport zoom level is within the configured range for 10km grids (default 8-20)
- **THEN** the layer renders 10km grid boundaries as PathLayer lines

#### Scenario: Rendering 1km grid
- **WHEN** the viewport zoom level is within the configured range for 1km grids (default 11-20)
- **THEN** the layer renders 1km grid boundaries as PathLayer lines

#### Scenario: All precision levels visible at high zoom
- **WHEN** the viewport zoom level is 15
- **THEN** GZD, 100km, 10km, and 1km grid lines are all rendered simultaneously

#### Scenario: Fine-to-coarse draw order
- **WHEN** multiple precision levels are rendered simultaneously
- **THEN** GZD lines are drawn on top of 10km lines, and 10km lines are drawn on top of 1km lines

### Requirement: Grid layers render cell labels
Both layers SHALL render text labels for grid cells when showLabels is enabled and zoom meets the label visibility threshold.

#### Scenario: Labels visible at sufficient zoom
- **WHEN** showLabels is true AND zoom is at or above the labelMinZoom threshold for a grid type
- **THEN** the layer renders TextLayer labels at the center of each visible cell

#### Scenario: Labels hidden when showLabels is false
- **WHEN** showLabels is false
- **THEN** the layer renders no text labels regardless of zoom level

#### Scenario: Labels hidden below zoom threshold
- **WHEN** showLabels is true BUT zoom is below the labelMinZoom threshold
- **THEN** the layer renders no text labels for that grid type

### Requirement: Grid layers calculate visible geometry from viewport bounds
Both layers SHALL only generate geometry for cells intersecting the current viewport to optimize performance.

#### Scenario: Geometry generation limited to viewport
- **WHEN** the viewport changes (pan or zoom)
- **THEN** the layer recalculates viewport bounds and generates geometry only for cells intersecting those bounds

#### Scenario: Empty result for invalid viewport
- **WHEN** viewport bounds cannot be determined
- **THEN** the layer renders no geometry and returns an empty layer array

### Requirement: GARS layer integrates with @ngageoint/gars-js
The GARSLayer SHALL use the Grids API from @ngageoint/gars-js. A Grids instance is created once in the `createGARSRenderer()` factory and reused across renders.

#### Scenario: Grids instance created on renderer initialization
- **WHEN** `createGARSRenderer()` is called (at definition creation time)
- **THEN** a Grids instance is created via `Grids.create()` and captured in the renderer closure

#### Scenario: Grid objects retrieved by type
- **WHEN** rendering a specific precision level
- **THEN** the renderer calls `grids.getGrid(GridType)` to obtain the grid object for that precision

### Requirement: MGRS layer integrates with @ngageoint/mgrs-js
The MGRSLayer SHALL use the Grids and GridZones APIs from @ngageoint/mgrs-js. A Grids instance is created once in the `createMGRSRenderer()` factory and reused across renders.

#### Scenario: Grids instance created on renderer initialization
- **WHEN** `createMGRSRenderer()` is called (at definition creation time)
- **THEN** a Grids instance is created via `Grids.create()` and captured in the renderer closure

#### Scenario: Zone ranges calculated from viewport
- **WHEN** calculating visible zones
- **THEN** the renderer calls `GridZones.getGridRange` with viewport bounds to get intersecting zones

### Requirement: MGRS layer enables longitude wrapping; GARS does not
The MGRSLayer SHALL set wrapLongitude to true on PathLayer. The GARSLayer SHALL NOT — rendering near the antimeridian is a known limitation pending verification that gars-js polygons are pre-normalized.

#### Scenario: MGRS grid lines wrap across antimeridian
- **WHEN** MGRS grid lines cross the antimeridian (±180° longitude)
- **THEN** the lines render correctly without visual discontinuities

#### Scenario: GARS grid near antimeridian
- **WHEN** the viewport spans the antimeridian
- **THEN** GARS cells may have rendering gaps (known limitation)

### Requirement: Grid layers accept custom zoom ranges
Both layers SHALL accept a zoomRanges prop to override default zoom thresholds per grid type.

#### Scenario: Custom zoom ranges override defaults
- **WHEN** a developer provides a custom zoomRanges prop
- **THEN** the layer uses the custom ranges instead of defaults

#### Scenario: Invalid zoom range throws at construction
- **WHEN** a zoom range has minZoom greater than maxZoom
- **THEN** the layer throws a descriptive error at construction time (e.g., `"Invalid zoom range for KILOMETER: minZoom (15) > maxZoom (10)"`)

#### Scenario: Labels delayed until higher zoom
- **WHEN** a zoom range specifies labelMinZoom higher than minZoom
- **THEN** grid lines render at minZoom but labels only render starting at labelMinZoom

### Requirement: Grid layers accept per-grid-type style overrides
Both layers SHALL accept named style override props per precision level that partially merge with default styles.

#### Scenario: GARS style overrides applied
- **WHEN** a developer provides thirtyMinuteStyle, fifteenMinuteStyle, or fiveMinuteStyle props
- **THEN** the GARSLayer merges those styles with defaults for each respective grid type

#### Scenario: MGRS style overrides applied
- **WHEN** a developer provides gzdStyle, grid100kmStyle, grid10kmStyle, or grid1kmStyle props
- **THEN** the MGRSLayer merges those styles with defaults for each respective grid type

#### Scenario: Partial style override
- **WHEN** a developer provides only some style properties (e.g., just lineColor)
- **THEN** the layer uses the custom property and defaults for unspecified properties

### Requirement: Grid style configuration supports all deck.gl color formats
The styling API SHALL accept colors as RGB/RGBA arrays, hex strings, or named colors.

### Requirement: Label styling includes font and background customization
GridStyleConfig SHALL support fontFamily, fontWeight, textAnchor, alignmentBaseline, backgroundColor, and backgroundPadding for label rendering.

### Requirement: Grid layers emit hover events via event bus
Both layers SHALL emit a `gridCell:hover` event through @accelint/bus when the cursor moves onto a new grid cell.

#### Scenario: Hover event emitted on cell entry
- **WHEN** a user's cursor moves over a new grid cell
- **THEN** the layer emits a `gridCell:hover` event with cellId, gridType, cell bounds, and mapId

#### Scenario: No duplicate hover events
- **WHEN** the cursor remains within the same grid cell
- **THEN** no additional hover events are emitted until the cell changes

### Requirement: Grid layers emit click events via event bus
Both layers SHALL emit a `gridCell:click` event through @accelint/bus when a user clicks on a grid cell.

#### Scenario: Click event emitted on cell click
- **WHEN** a user clicks on a grid cell
- **THEN** the layer emits a `gridCell:click` event with cellId, gridType, geographic coordinates, cell bounds, and mapId

### Requirement: Grid layers support event bus opt-out
Both layers SHALL allow disabling event bus integration via the `enableInteractivity` prop.

#### Scenario: Events disabled via prop
- **WHEN** enableInteractivity is false
- **THEN** the layer does not emit events and grid cells are not pickable

### Requirement: Grid layers support React Fiber rendering
Both layers SHALL be registerable with React Fiber via fiber.ts, enabling `<garsLayer />` and `<mgrsLayer />` JSX syntax.

### Requirement: Grid layers export TypeScript types and constants
The following SHALL be exported for consumer use: `GARSLayerProps`, `MGRSLayerProps`, `GridStyleConfig`, `GridZoomRange`, `GridCellEvents`, `GridCellHoverEvent`, `GridCellClickEvent`, `GridCellEvent`, `GARS_ZOOM_RANGES`, `MGRS_ZOOM_RANGES`, `garsDefinition`, `mgrsDefinition`.