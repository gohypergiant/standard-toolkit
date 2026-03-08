## ADDED Requirements

### Requirement: Grid layers accept custom zoom ranges per grid type
The grid layers SHALL accept a zoomRanges prop allowing users to customize the minimum and maximum zoom levels for each grid precision type. Each zoom range configuration SHALL specify the grid type, min zoom, max zoom, and optional label min zoom.

#### Scenario: Custom zoom ranges provided
- **WHEN** a developer provides custom zoomRanges prop with modified zoom thresholds
- **THEN** the layer uses the custom zoom ranges instead of defaults for rendering decisions

#### Scenario: Partial zoom range override
- **WHEN** a developer provides zoom ranges for only some grid types
- **THEN** the layer uses custom ranges for specified types and defaults for unspecified types

#### Scenario: Invalid zoom range throws at construction
- **WHEN** a developer provides a zoom range with minZoom greater than maxZoom
- **THEN** the layer throws a descriptive error at construction time identifying the invalid range (e.g., `"Invalid zoom range for KILOMETER: minZoom (15) > maxZoom (10)"`)

### Requirement: Grid layers provide sensible default zoom ranges
The grid layers SHALL provide default zoom ranges based on standard grid visualization practices, optimized for visual clarity and performance at each zoom level.

#### Scenario: GARS default zoom ranges applied
- **WHEN** no custom zoomRanges prop is provided for GARSLayer
- **THEN** the layer uses default ranges: 30-minute (6-8), 15-minute (8-12), 5-minute (12-20)

#### Scenario: MGRS default zoom ranges applied
- **WHEN** no custom zoomRanges prop is provided for MGRSLayer
- **THEN** the layer uses default ranges: GZD (0-20), 100km (4-20), 10km (8-20), 1km (11-20)

### Requirement: Zoom range configuration includes label visibility thresholds
Each zoom range configuration SHALL support an optional labelMinZoom threshold controlling when labels appear independently from when grid lines appear.

#### Scenario: Labels delayed until higher zoom
- **WHEN** a zoom range specifies labelMinZoom higher than minZoom
- **THEN** grid lines render at minZoom but labels only render starting at labelMinZoom

#### Scenario: Labels and lines appear together
- **WHEN** a zoom range does not specify labelMinZoom
- **THEN** labels render at the same zoom level as grid lines (minZoom)

### Requirement: Zoom range configuration supports overlapping ranges
The grid layers SHALL support overlapping zoom ranges allowing multiple grid precision levels to render simultaneously at the same zoom level for reference context.

#### Scenario: Multiple grid types visible at same zoom
- **WHEN** zoom ranges overlap (e.g., 100km range 4-20 overlaps with 10km range 8-20)
- **THEN** both grid types render simultaneously when zoom is within the overlapping range

#### Scenario: Layer draw order preserved
- **WHEN** multiple grid types render at the same zoom level
- **THEN** coarser grid types render on top of finer grid types for visual clarity

### Requirement: Zoom range configuration is exported as a TypeScript type
The grid layers SHALL export a GridZoomRange TypeScript interface defining the structure of zoom range configuration objects.

#### Scenario: Type-safe zoom range configuration
- **WHEN** a developer constructs custom zoom ranges in TypeScript
- **THEN** they receive type checking and intellisense for the zoom range structure

### Requirement: Default zoom range constants are exported for customization
The grid layers SHALL export default zoom range constants enabling developers to build upon defaults rather than replacing them entirely.

#### Scenario: Extending default zoom ranges
- **WHEN** a developer imports default zoom range constants
- **THEN** they can spread defaults and override specific properties for incremental customization
