## ADDED Requirements

### Requirement: Grid layers emit hover events via event bus
The grid layers SHALL emit hover events through @accelint/bus when a user's cursor enters or exits a grid cell. Events SHALL include the cell identifier, grid type, and map instance ID.

#### Scenario: Hover enter event emitted
- **WHEN** a user's cursor moves over a grid cell
- **THEN** the layer emits a grid.hover.enter event with cell identifier, grid type, and map instance ID

#### Scenario: Hover exit event emitted
- **WHEN** a user's cursor moves out of a grid cell
- **THEN** the layer emits a grid.hover.exit event with the previous cell identifier, grid type, and map instance ID

#### Scenario: No duplicate hover events
- **WHEN** a user's cursor remains within the same grid cell
- **THEN** the layer does not emit additional hover events until the cell changes

### Requirement: Grid layers emit click events via event bus
The grid layers SHALL emit click events through @accelint/bus when a user clicks on a grid cell. Events SHALL include the cell identifier, grid type, click coordinates, and map instance ID.

#### Scenario: Click event emitted on cell click
- **WHEN** a user clicks on a grid cell
- **THEN** the layer emits a grid.click event with cell identifier, grid type, click coordinates, and map instance ID

#### Scenario: Click event includes viewport coordinates
- **WHEN** a click event is emitted
- **THEN** the event payload includes both geographic coordinates and screen coordinates of the click

### Requirement: Grid layers emit selection events via event bus
The grid layers SHALL emit selection events through @accelint/bus when a grid cell selection state changes. Events SHALL distinguish between single selection and multi-selection scenarios.

#### Scenario: Selection event on cell select
- **WHEN** a grid cell is selected
- **THEN** the layer emits a grid.selected event with cell identifier, grid type, and map instance ID

#### Scenario: Deselection event on cell deselect
- **WHEN** a grid cell is deselected
- **THEN** the layer emits a grid.deselected event with cell identifier, grid type, and map instance ID

### Requirement: Event bus integration follows DisplayShapeLayer pattern
The grid layers SHALL implement event bus integration following the established pattern from DisplayShapeLayer, including typed event bus instance creation and event payload structure.

#### Scenario: Typed event bus instance
- **WHEN** the layer initializes event bus integration
- **THEN** it creates a typed Broadcast instance using Broadcast.getInstance<GridEvent>()

#### Scenario: Event payload includes map instance ID
- **WHEN** any grid event is emitted
- **THEN** the event payload includes the map instance ID to support multi-map isolation

### Requirement: Grid layers support event bus opt-out
The grid layers SHALL allow disabling event bus integration via a prop to support use cases where event handling is managed externally.

#### Scenario: Events disabled via prop
- **WHEN** enableEvents prop is set to false
- **THEN** the layer does not emit any events to the event bus

#### Scenario: Events enabled by default
- **WHEN** enableEvents prop is not specified
- **THEN** the layer emits events to the event bus (default behavior)

### Requirement: Grid event types are exported for consumer type safety
The grid layers SHALL export TypeScript event type definitions enabling consumers to handle events with full type safety.

#### Scenario: Event type definitions available
- **WHEN** a developer imports event types from the grid layers package
- **THEN** they can type-safely handle grid events using the exported event interfaces
