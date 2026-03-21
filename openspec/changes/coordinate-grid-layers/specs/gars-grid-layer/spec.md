## ADDED Requirements

### Requirement: GARS layer renders grid lines at appropriate zoom levels
The GARSLayer SHALL render GARS grid lines at three precision levels based on viewport zoom: 30-minute cells (coarsest), 15-minute cells (medium), and 5-minute cells (finest). Each precision level SHALL have configurable minimum and maximum zoom thresholds to control visibility.

#### Scenario: Rendering 30-minute grid at low zoom
- **WHEN** the viewport zoom level is between the configured minZoom and maxZoom for 30-minute grids (default 6-8)
- **THEN** the layer renders 30-minute GARS cell boundaries as PathLayer lines

#### Scenario: Rendering 15-minute grid at medium zoom
- **WHEN** the viewport zoom level is between the configured minZoom and maxZoom for 15-minute grids (default 8-12)
- **THEN** the layer renders 15-minute GARS cell boundaries as PathLayer lines

#### Scenario: Rendering 5-minute grid at high zoom
- **WHEN** the viewport zoom level is between the configured minZoom and maxZoom for 5-minute grids (default 12-20)
- **THEN** the layer renders 5-minute GARS cell boundaries as PathLayer lines

#### Scenario: No rendering outside zoom range
- **WHEN** the viewport zoom level is outside the configured range for all grid types
- **THEN** the layer renders no grid lines

### Requirement: GARS layer renders cell labels
The GARSLayer SHALL render text labels for GARS cells when showLabels prop is enabled and zoom level meets the label visibility threshold. Labels SHALL display the GARS coordinate identifier (e.g., "006AG39").

#### Scenario: Labels visible at sufficient zoom
- **WHEN** showLabels is true AND zoom level is at or above the labelMinZoom threshold for a grid type
- **THEN** the layer renders TextLayer labels at the center of each visible GARS cell

#### Scenario: Labels hidden when showLabels is false
- **WHEN** showLabels is false
- **THEN** the layer renders no text labels regardless of zoom level

#### Scenario: Labels hidden below zoom threshold
- **WHEN** showLabels is true BUT zoom level is below the labelMinZoom threshold
- **THEN** the layer renders no text labels for that grid type

### Requirement: GARS layer calculates visible cells based on viewport bounds
The GARSLayer SHALL calculate which GARS cells intersect the current viewport bounds and only generate geometry for visible cells to optimize performance.

#### Scenario: Geometry generation limited to viewport
- **WHEN** the viewport changes (pan or zoom)
- **THEN** the layer recalculates viewport bounds and generates geometry only for GARS cells intersecting those bounds

#### Scenario: Empty result for invalid viewport
- **WHEN** viewport bounds cannot be determined
- **THEN** the layer renders no geometry and returns an empty layer array

### Requirement: GARS layer integrates with @ngageoint/gars-js library
The GARSLayer SHALL use the Grids API from @ngageoint/gars-js to obtain grid definitions and generate cell boundaries. The layer SHALL create a Grids instance during initialization and retrieve grid objects by GridType.

#### Scenario: Grids instance created on initialization
- **WHEN** the layer's initializeState method is called
- **THEN** a Grids instance is created using Grids.create()

#### Scenario: Grid objects retrieved by type
- **WHEN** rendering a specific grid precision level
- **THEN** the layer calls grids.getGrid(GridType) to obtain the grid object for that precision

### Requirement: GARS layer antimeridian handling is a known limitation
The GARSLayer PathLayer SHALL NOT set wrapLongitude to true. GARS cell polygons near the antimeridian may not render correctly in all cases. This is a known limitation carried forward from the reference implementation pending verification of whether gars-js cell polygons require longitude normalization before Deck.gl renders them correctly near ±180°.

#### Scenario: GARS grid near antimeridian
- **WHEN** the viewport spans the antimeridian
- **THEN** GARS cells on both sides may have rendering gaps or discontinuities (known limitation; MGRS uses wrapLongitude: true to avoid this)

### Requirement: GARS layer supports React Fiber rendering
The GARSLayer SHALL be registerable with React Fiber renderer via a fiber.ts module, enabling JSX syntax usage in React applications.

#### Scenario: JSX element usage
- **WHEN** a developer imports the fiber module
- **THEN** they can use `<garsLayer />` JSX syntax in React Fiber-based deck.gl applications

### Requirement: GARS layer provides TypeScript type definitions
The GARSLayer SHALL export comprehensive TypeScript types including GARSLayerProps interface extending CompositeLayerProps with all supported props and style configuration interfaces.

#### Scenario: Type inference in TypeScript
- **WHEN** a developer constructs a GARSLayer instance in TypeScript
- **THEN** they receive full intellisense and type checking for all layer props
