## ADDED Requirements

> **Note:** The reference implementation's `GridLevelStyle` used RGBA arrays only and defined five properties (lineColor, lineWidth, labelColor, labelSize, labelBackgroundColor). This spec extends the styling API with additional color format support and font customization options. These are deliberate additions beyond the reference — not ported from the handoff.



### Requirement: Grid layers accept per-grid-type style overrides
The grid layers SHALL accept style override props for each grid precision type, allowing customization of line color, line width, label color, label size, and background color. Style overrides SHALL partially merge with default styles.

#### Scenario: GARS style overrides applied
- **WHEN** a developer provides thirtyMinuteStyle, fifteenMinuteStyle, or fiveMinuteStyle props
- **THEN** the GARSLayer merges provided styles with defaults for each respective grid type

#### Scenario: MGRS style overrides applied
- **WHEN** a developer provides gzdStyle, hundredKmStyle, tenKmStyle, or kilometerStyle props
- **THEN** the MGRSLayer merges provided styles with defaults for each respective grid type

#### Scenario: Partial style override
- **WHEN** a developer provides only some style properties (e.g., just lineColor)
- **THEN** the layer uses the custom property and defaults for unspecified properties

### Requirement: Grid layers provide opinionated default styles
The grid layers SHALL provide default styles using a dark color palette with progressive line weights distinguishing coarser from finer grid types.

#### Scenario: GARS default styles applied
- **WHEN** no custom styles are provided for GARSLayer
- **THEN** the layer uses default styles with darker colors and heavier lines for 30-minute grids, progressively lighter and thinner for finer grids

#### Scenario: MGRS default styles applied
- **WHEN** no custom styles are provided for MGRSLayer
- **THEN** the layer uses default styles with darker colors and heavier lines for GZD, progressively lighter and thinner for finer grids

### Requirement: Grid style configuration supports all deck.gl color formats
The styling API SHALL accept colors in any format supported by deck.gl: RGB arrays, RGBA arrays, hex strings, or named colors.

#### Scenario: RGBA array color
- **WHEN** a developer provides lineColor as [255, 0, 0, 128]
- **THEN** the layer applies semi-transparent red to grid lines

#### Scenario: Hex string color
- **WHEN** a developer provides lineColor as "#FF0000"
- **THEN** the layer converts and applies red color to grid lines

#### Scenario: Named color
- **WHEN** a developer provides lineColor as "red"
- **THEN** the layer applies red color to grid lines

### Requirement: Label styling includes font customization
The grid style configuration SHALL support label-specific styling including font family, font weight, text anchor, and alignment baseline.

#### Scenario: Custom label font
- **WHEN** a developer provides fontFamily in style config
- **THEN** labels render using the specified font family

#### Scenario: Label positioning customization
- **WHEN** a developer provides textAnchor and alignmentBaseline in style config
- **THEN** labels render with the specified text positioning

### Requirement: Grid layers support label background styling
The grid layers SHALL render label backgrounds with customizable background color and padding to improve readability over map tiles.

#### Scenario: Custom label background
- **WHEN** a developer provides backgroundColor in style config
- **THEN** labels render with the specified background color

#### Scenario: Background padding applied
- **WHEN** labels are rendered with backgrounds
- **THEN** the background extends beyond label text by the configured padding

### Requirement: Style configuration interface is exported as TypeScript type
The grid layers SHALL export a GridStyleConfig TypeScript interface defining all available style properties with their types.

#### Scenario: Type-safe style configuration
- **WHEN** a developer constructs custom styles in TypeScript
- **THEN** they receive type checking and intellisense for all style properties

### Requirement: Default style constants are exported for customization
The grid layers SHALL export default style constants enabling developers to build upon defaults rather than replacing them entirely.

#### Scenario: Extending default styles
- **WHEN** a developer imports default style constants
- **THEN** they can spread defaults and override specific properties for incremental customization
