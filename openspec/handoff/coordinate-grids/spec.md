## Grid Rendering

### Requirement: MGRS zoom-adaptive rendering
The MGRS layer SHALL render grid lines and labels at four precision levels — GZD, 100km, 10km, and 1km — each visible only within its configured zoom range.

#### Scenario: GZD visible at low zoom
- **WHEN** the map zoom is within the GZD zoom range (0–20)
- **THEN** GZD zone boundary lines are rendered across the viewport

#### Scenario: 1km grid hidden at low zoom
- **WHEN** the map zoom is below the 1km minimum zoom (11)
- **THEN** no 1km grid lines are rendered

#### Scenario: Correct precision at mid zoom
- **WHEN** the map zoom is 9
- **THEN** GZD and 100km lines are rendered; 10km and 1km lines are not

### Requirement: MGRS coarser grids persist at higher zoom
At zoom levels where finer MGRS grids are visible, coarser grid levels SHALL also remain visible for reference.

#### Scenario: GZD visible alongside 1km grid
- **WHEN** the map zoom is 15
- **THEN** GZD, 100km, 10km, and 1km lines are all rendered simultaneously

### Requirement: GARS zoom-adaptive rendering
The GARS layer SHALL render grid lines and labels at three precision levels — 30-minute, 15-minute, and 5-minute — each visible only within its configured zoom range.

#### Scenario: 30-minute grid at low zoom
- **WHEN** the map zoom is 7
- **THEN** 30-minute GARS cell lines are rendered

#### Scenario: 5-minute grid at high zoom
- **WHEN** the map zoom is 13
- **THEN** 5-minute GARS cell lines are rendered

#### Scenario: Only one GARS level at mid zoom
- **WHEN** the map zoom is 10
- **THEN** only 15-minute GARS lines are rendered

### Requirement: Draw order — coarser on top
Grid precision levels SHALL be rendered fine-to-coarse so that coarser grid boundaries are visually on top of finer ones.

#### Scenario: GZD lines visible over fine grid
- **WHEN** multiple precision levels are rendered simultaneously
- **THEN** coarser level lines (e.g. GZD) are drawn on top of finer level lines (e.g. 10km)

### Requirement: Grid lines are not pickable
Grid line and label layers SHALL NOT be pickable. They are visual reference only.

#### Scenario: Click on grid line
- **WHEN** a user clicks on a rendered grid line
- **THEN** no pick event is raised by the grid layer

---

## Labels

### Requirement: Configurable label visibility
Both MGRS and GARS layers SHALL support toggling labels on or off.

#### Scenario: Labels hidden when disabled
- **WHEN** `showLabels` is false
- **THEN** no text labels are rendered for any precision level

#### Scenario: Labels shown at appropriate zoom
- **WHEN** `showLabels` is true and the zoom meets a precision level's label minimum zoom
- **THEN** labels are rendered for that precision level

#### Scenario: Labels suppressed below label minimum zoom
- **WHEN** `showLabels` is true but the zoom is below a precision level's label minimum zoom
- **THEN** no labels are rendered for that precision level, even if lines are

### Requirement: Label background rendering
Grid labels SHALL render with an opaque background to remain legible over map imagery.

#### Scenario: Label background visible
- **WHEN** a label is rendered
- **THEN** it has a filled background matching the precision level's configured background color

---

## Styling

### Requirement: Per-precision-level style configuration
Each grid precision level SHALL have independently configurable line color, line width, label color, label size, and label background color.

#### Scenario: GZD styled differently from 10km
- **WHEN** different style configs are provided for GZD and 10km
- **THEN** each precision level renders with its own line width and color

#### Scenario: Default styles applied when not specified
- **WHEN** no style is provided for a precision level
- **THEN** a built-in default style is applied

---

## Viewport Handling

### Requirement: Viewport-clipped rendering
The grid SHALL only render cells that intersect the current viewport. Cells outside the viewport SHALL NOT be computed or rendered.

#### Scenario: Grid updates on pan
- **WHEN** the user pans the map to a new area
- **THEN** the grid re-renders with cells covering the new viewport

#### Scenario: Grid updates on zoom
- **WHEN** the user zooms in or out
- **THEN** the grid re-renders with the appropriate precision levels for the new zoom

### Requirement: Antimeridian crossing
The viewport bounds calculation SHALL correctly handle viewports that cross the antimeridian (180° / -180° longitude boundary).

#### Scenario: Grid renders across date line
- **WHEN** the viewport spans the antimeridian (e.g. center near 180°)
- **THEN** grid cells on both sides of the antimeridian are rendered without clipping or duplication

### Requirement: Full-globe viewport
When the viewport is wide enough to show the entire globe, the grid SHALL cover the full valid geographic extent.

#### Scenario: Zoomed out to world view
- **WHEN** the viewport width equals or exceeds the full world pixel width at the current zoom
- **THEN** bounds are set to the full valid extent (-180 to 180 longitude, -80 to 84 latitude)

### Requirement: Latitude clamping
Viewport latitude bounds SHALL be clamped to the valid range for MGRS (-80° to 84°).

#### Scenario: Bounds clamped at poles
- **WHEN** the viewport extends beyond ±80°/84° latitude
- **THEN** the computed bounds are clamped to -80° (south) and 84° (north)

---

## Selection Overlay

### Requirement: Hover highlight
The selection overlay SHALL render a distinct translucent highlight over the currently hovered cell.

#### Scenario: Hovered cell highlighted
- **WHEN** a cell is set as hovered
- **THEN** a translucent white polygon is rendered over that cell

#### Scenario: No highlight when no hover
- **WHEN** no cell is hovered
- **THEN** no hover polygon is rendered

### Requirement: Multi-cell selection highlight
The selection overlay SHALL render a distinct translucent highlight over all selected cells, using a different color from the hover highlight.

#### Scenario: Selected cells highlighted
- **WHEN** one or more cells are in the selected set
- **THEN** a translucent blue polygon is rendered over each selected cell

### Requirement: Hovered cell suppressed when selected
A cell that is already selected SHALL NOT also show the hover highlight.

#### Scenario: Hover suppressed on selected cell
- **WHEN** a cell is both hovered and selected
- **THEN** only the selected highlight is rendered (not the hover highlight)
