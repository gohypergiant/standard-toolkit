## ADDED Requirements

### Requirement: MGRS layer renders grid lines at appropriate zoom levels
The MGRSLayer SHALL render MGRS grid lines at four precision levels based on viewport zoom: GZD (Grid Zone Designator), 100km grids, 10km grids, and 1km grids. Each precision level SHALL have configurable minimum and maximum zoom thresholds to control visibility.

#### Scenario: Rendering GZD grid at all zoom levels
- **WHEN** the viewport zoom level is between the configured minZoom and maxZoom for GZD (default 0-20)
- **THEN** the layer renders GZD boundaries as PathLayer lines

#### Scenario: Rendering 100km grid from low to high zoom
- **WHEN** the viewport zoom level is between the configured minZoom and maxZoom for 100km grids (default 4-20)
- **THEN** the layer renders 100km grid boundaries as PathLayer lines

#### Scenario: Rendering 10km grid at medium to high zoom
- **WHEN** the viewport zoom level is between the configured minZoom and maxZoom for 10km grids (default 8-20)
- **THEN** the layer renders 10km grid boundaries as PathLayer lines

#### Scenario: Rendering 1km grid at high zoom
- **WHEN** the viewport zoom level is between the configured minZoom and maxZoom for 1km grids (default 11-20)
- **THEN** the layer renders 1km grid boundaries as PathLayer lines

### Requirement: MGRS layer renders cell labels
The MGRSLayer SHALL render text labels for MGRS grid cells when showLabels prop is enabled and zoom level meets the label visibility threshold. Labels SHALL display the appropriate MGRS identifier for the grid type.

#### Scenario: Labels visible at sufficient zoom
- **WHEN** showLabels is true AND zoom level is at or above the labelMinZoom threshold for a grid type
- **THEN** the layer renders TextLayer labels at the center of each visible MGRS cell

#### Scenario: Labels hidden when showLabels is false
- **WHEN** showLabels is false
- **THEN** the layer renders no text labels regardless of zoom level

#### Scenario: Labels hidden below zoom threshold
- **WHEN** showLabels is true BUT zoom level is below the labelMinZoom threshold
- **THEN** the layer renders no text labels for that grid type

### Requirement: MGRS layer calculates visible zones and generates geometry per zone
The MGRSLayer SHALL use GridZones.getGridRange to determine which MGRS zones intersect the viewport bounds, then generate geometry for each zone independently to handle zone-specific grid variations.

#### Scenario: Zone-based geometry generation
- **WHEN** the viewport changes
- **THEN** the layer calculates intersecting zones using GridZones.getGridRange and generates geometry for each zone

#### Scenario: Empty result for invalid viewport
- **WHEN** viewport bounds cannot be determined
- **THEN** the layer renders no geometry and returns an empty layer array

### Requirement: Coarser MGRS grid levels persist at higher zoom
The MGRSLayer SHALL keep coarser grid levels visible at zoom levels where finer grids are also active. When a 1km grid is rendered, GZD, 100km, and 10km boundaries SHALL remain visible simultaneously for operator orientation.

#### Scenario: All precision levels visible at high zoom
- **WHEN** the viewport zoom level is 15
- **THEN** GZD, 100km, 10km, and 1km grid lines are all rendered simultaneously

#### Scenario: Coarser grids not hidden when finer grids appear
- **WHEN** zoom crosses the 1km minZoom threshold
- **THEN** GZD boundaries remain visible alongside 1km cells

### Requirement: MGRS precision levels render in fine-to-coarse draw order
The MGRSLayer SHALL render precision levels ordered fine-to-coarse so that coarser grid boundaries are drawn on top of finer ones. This ensures coarser boundaries remain visually prominent and are not obscured by finer grid lines.

#### Scenario: GZD lines visible over finer grid lines
- **WHEN** multiple precision levels are rendered simultaneously
- **THEN** GZD lines are drawn on top of 10km lines, and 10km lines are drawn on top of 1km lines

### Requirement: MGRS layer enables longitude wrapping
The MGRSLayer SHALL configure PathLayer with wrapLongitude set to true to properly handle grid lines that cross the antimeridian.

#### Scenario: Grid lines wrap across antimeridian
- **WHEN** MGRS grid lines cross the antimeridian (±180° longitude)
- **THEN** the lines render correctly without visual discontinuities due to wrapLongitude being enabled

### Requirement: MGRS layer integrates with @ngageoint/mgrs-js library
The MGRSLayer SHALL use the Grids and GridZones APIs from @ngageoint/mgrs-js to obtain grid definitions, zone ranges, and generate cell boundaries.

#### Scenario: Grids instance created on initialization
- **WHEN** the layer's initializeState method is called
- **THEN** a Grids instance is created using Grids.create()

#### Scenario: Grid objects retrieved by type
- **WHEN** rendering a specific grid precision level
- **THEN** the layer calls grids.getGrid(GridType) to obtain the grid object for that precision

#### Scenario: Zone ranges calculated from viewport
- **WHEN** calculating visible zones
- **THEN** the layer calls GridZones.getGridRange with viewport bounds to get intersecting zones

### Requirement: MGRS layer supports React Fiber rendering
The MGRSLayer SHALL be registerable with React Fiber renderer via a fiber.ts module, enabling JSX syntax usage in React applications.

#### Scenario: JSX element usage
- **WHEN** a developer imports the fiber module
- **THEN** they can use `<mgrsLayer />` JSX syntax in React Fiber-based deck.gl applications

### Requirement: MGRS layer provides TypeScript type definitions
The MGRSLayer SHALL export comprehensive TypeScript types including MGRSLayerProps interface extending CompositeLayerProps with all supported props and style configuration interfaces.

#### Scenario: Type inference in TypeScript
- **WHEN** a developer constructs an MGRSLayer instance in TypeScript
- **THEN** they receive full intellisense and type checking for all layer props
