---
related: []
last_touched_by: bearing-range
last_touched_on: 2026-09-16
---

# Bearing-Range Measurement

## Purpose

Interactive drag-to-measure tool providing great-circle distance (km + NM) and true bearing (0-360°) between two map points, rendered at the line's midpoint.

## Related Specs

## Requirements

### Requirement: User can measure bearing and distance between two map points
The system SHALL provide an interactive tool that displays the great-circle distance and true bearing between two points selected by dragging on the map.

#### Scenario: Successful measurement
- **WHEN** user drags from pointA `[10.0, 20.0]` to pointB `[11.0, 21.0]`
- **THEN** system displays great-circle distance in kilometers and nautical miles
- **THEN** system displays true bearing (0-360°) from pointA to pointB

#### Scenario: Hook exposes raw values for formatting
- **WHEN** a measurement from pointA `[10.0, 20.0]` to pointB `[11.0, 21.0]` is active
- **THEN** `useMeasurement(mapId)` returns `{ isMeasuring: true, pointA, pointB, distanceMeters, bearingDeg, start, clear }`
- **THEN** `distanceMeters` is the great-circle distance in meters and `bearingDeg` is the initial bearing in degrees (0-360)
- **THEN** consumers format the readout with `formatDistance(distanceMeters, units)` and `formatBearing(bearingDeg)` from `@accelint/formatters/bearing`

#### Scenario: Non-finite points yield no measurement
- **WHEN** pointA or pointB contains a non-finite component (`NaN` or `Infinity`)
- **THEN** `useMeasurement` returns `distanceMeters: 0` and `bearingDeg: 0` without throwing
- **THEN** `MeasurementLayer` renders no line, endpoints, or label

#### Scenario: Measurement cleared
- **WHEN** user calls `clear()` action
- **THEN** system removes measurement line and label from display
- **THEN** system emits `measurement:clear` event with `{ mapId }`

#### Scenario: Zero-distance measurement
- **WHEN** user drags but pointA and pointB are identical coordinates
- **THEN** system displays "0 km / 0 NM | BRG: 0°"
- **THEN** system renders endpoints but no visible line

### Requirement: Measurement SHALL emit lifecycle events on the bus
The system SHALL emit namespaced bus events for measurement lifecycle: start, update, complete, and clear.

#### Scenario: Start event emitted
- **WHEN** user begins drag at pointA `[10.0, 20.0]`
- **THEN** system emits `measurement:start` with payload `{ mapId: 'main', pointA: [10.0, 20.0], pointB: null }`

#### Scenario: Start restarts an active measurement
- **WHEN** a measurement is active with pointB `[10.5, 20.5]`
- **WHEN** `start([12.0, 22.0])` is called
- **THEN** system resets pointB to `null` and sets pointA to `[12.0, 22.0]`
- **THEN** system emits `measurement:start` with payload `{ mapId: 'main', pointA: [12.0, 22.0], pointB: null }`
- **THEN** map pan remains suppressed

#### Scenario: Update event emitted on every drag move
- **WHEN** user drags to interim pointB `[10.5, 20.5]`
- **THEN** system emits `measurement:update` with payload `{ mapId: 'main', pointA: [10.0, 20.0], pointB: [10.5, 20.5] }`
- **WHEN** the next drag move reports the same coordinate `[10.5, 20.5]`
- **THEN** system emits `measurement:update` again (updates are not deduplicated)

#### Scenario: Complete event emitted
- **WHEN** user releases drag at final pointB `[11.0, 21.0]`
- **THEN** system emits `measurement:complete` with a `MeasurementCompletePayload` `{ mapId: 'main', pointA: [10.0, 20.0], pointB: [11.0, 21.0] }` whose `pointB` is never `null`

#### Scenario: Complete with no endpoint clears
- **WHEN** user presses and releases without a drag move, so pointB is `null`
- **THEN** system behaves as `clear()`: state resets to idle and `measurement:clear` is emitted with `{ mapId: 'main' }`
- **THEN** system does NOT emit `measurement:complete`

#### Scenario: Events emitted once per map
- **WHEN** two `useMeasurement('main')` instances are mounted
- **WHEN** user completes a drag on map 'main'
- **THEN** system emits each lifecycle event exactly once, because the `map:drag*` subscription is owned by the measurement store, not by each hook instance

### Requirement: BaseMap SHALL emit drag events on the bus
The system SHALL emit `map:dragStart`, `map:drag`, and `map:dragEnd` events from BaseMap with coordinate and modifier key information.

#### Scenario: Drag start event emitted
- **WHEN** user initiates drag at coordinate `[10.0, 20.0]` with shift key pressed
- **THEN** system emits `map:dragStart` with payload `{ id: 'main', coordinate: [10.0, 20.0], shiftKey: true, ctrlKey: false, altKey: false }`

#### Scenario: Drag move event emitted
- **WHEN** user drags to coordinate `[10.5, 20.5]`
- **THEN** system emits `map:drag` with payload `{ id: 'main', coordinate: [10.5, 20.5], shiftKey: true, ctrlKey: false, altKey: false }`

#### Scenario: Drag end event emitted
- **WHEN** user releases drag at coordinate `[11.0, 21.0]`
- **THEN** system emits `map:dragEnd` with a `MapDragEndPayload` `{ id: 'main', coordinate: [11.0, 21.0], shiftKey: true, ctrlKey: false, altKey: false }`

#### Scenario: Drag end always emitted
- **WHEN** user releases a drag at a position that does not unproject to finite coordinates (for example off the globe in 3D view)
- **THEN** system still emits `map:dragEnd` with `coordinate: null`
- **THEN** `map:dragStart` and `map:drag` are never emitted for non-finite positions; their `MapDragPayload.coordinate` is always a finite `[longitude, latitude]`

#### Scenario: Drag types exported from the deckgl barrel
- **WHEN** a consumer imports from `@accelint/map-toolkit/deckgl`
- **THEN** `MapDragPayload`, `MapDragEndPayload`, `MapDragStartEvent`, `MapDragEvent`, and `MapDragEndEvent` are available alongside the other `Map*` event types

### Requirement: Measurement SHALL support optional modifier key requirement
The system SHALL allow configuration of a required modifier key (shift, ctrl, alt) to activate measurement, enabling drag-to-pan when modifier is not pressed.

#### Scenario: Modifier key required and pressed
- **WHEN** `requiresModifier='alt'` is configured
- **WHEN** user drags with alt key pressed
- **THEN** system measures distance and bearing

#### Scenario: Modifier key required but not pressed
- **WHEN** `requiresModifier='alt'` is configured
- **WHEN** user drags without alt key
- **THEN** system ignores drag events
- **THEN** map pan operates normally

#### Scenario: Modifier released mid-drag
- **WHEN** `requiresModifier='alt'` is configured
- **WHEN** user is dragging with alt held and releases alt before releasing the mouse
- **THEN** system completes the measurement at the last captured coordinate
- **THEN** map pan is restored

#### Scenario: No modifier key required
- **WHEN** `requiresModifier` is undefined
- **WHEN** user drags (with or without any modifier keys)
- **THEN** system measures distance and bearing

#### Scenario: Modifier is per-map state
- **WHEN** `useMeasurement('main', 'alt')` is mounted and then `useMeasurement('main', 'ctrl')` is mounted
- **THEN** map 'main' requires `ctrl` (the most recently mounted hook's value wins)
- **THEN** map 'beta' is unaffected

### Requirement: Measurement SHALL support configurable distance units
The system SHALL display distance in configurable units: single unit mode or dual unit mode.

#### Scenario: Dual unit display (default)
- **WHEN** `units=['kilometers', 'nauticalmiles']` is configured
- **WHEN** distance is 100 km (54.0 NM)
- **THEN** system displays "100.0 km / 54.0 NM | BRG: 045°"

#### Scenario: Single unit display
- **WHEN** `units='kilometers'` is configured
- **WHEN** distance is 100 km
- **THEN** system displays "100.0 km | BRG: 045°"

#### Scenario: Nautical miles only
- **WHEN** `units='nauticalmiles'` is configured
- **WHEN** distance is 54.0 NM
- **THEN** system displays "54.0 NM | BRG: 045°"

### Requirement: Measurement SHALL display bearing as 0-360° true north
The system SHALL display bearing as integer degrees from 0-360° referenced to true north with zero-padding.

#### Scenario: Northeast bearing
- **WHEN** bearing from pointA to pointB is 45 degrees
- **THEN** system displays "BRG: 045°"

#### Scenario: Southwest bearing
- **WHEN** bearing from pointA to pointB is 225 degrees
- **THEN** system displays "BRG: 225°"

#### Scenario: North bearing
- **WHEN** bearing from pointA to pointB is 0 degrees
- **THEN** system displays "BRG: 000°"

#### Scenario: Negative bearing normalization
- **WHEN** geodesy calculation returns -10 degrees
- **THEN** system normalizes to 350 degrees
- **THEN** system displays "BRG: 350°"

### Requirement: Measurement SHALL suppress pan during drag
The system SHALL emit `map:disablePan` when measurement drag starts and `map:enablePan` when drag ends to prevent simultaneous pan and measurement.

#### Scenario: Pan disabled during measurement
- **WHEN** user starts measurement drag
- **THEN** system emits `map:disablePan` with `{ id: 'main' }`
- **THEN** map pan handlers ignore subsequent drag events

#### Scenario: Pan re-enabled after measurement
- **WHEN** user releases measurement drag
- **THEN** system emits `map:enablePan` with `{ id: 'main' }`
- **THEN** map pan handlers resume normal operation

#### Scenario: Pan restored when the last subscriber unmounts mid-drag
- **WHEN** a measurement drag is in progress on map 'main'
- **WHEN** the last `useMeasurement('main')` instance unmounts
- **THEN** system finishes the measurement and emits `map:enablePan` with `{ id: 'main' }`
- **THEN** the `map:drag*` subscription for map 'main' is removed

### Requirement: Measurement SHALL use per-mapId store for isolation
The system SHALL store measurement state in a per-mapId store created via `createMapStore` to support multiple map instances.

#### Scenario: Multiple map instances isolated
- **WHEN** map 'alpha' has active measurement at pointA `[10.0, 20.0]`, pointB `[11.0, 21.0]`
- **WHEN** map 'beta' has active measurement at pointA `[5.0, 15.0]`, pointB `[6.0, 16.0]`
- **THEN** `useMeasurement('alpha')` returns pointA `[10.0, 20.0]`, pointB `[11.0, 21.0]`
- **THEN** `useMeasurement('beta')` returns pointA `[5.0, 15.0]`, pointB `[6.0, 16.0]`

### Requirement: Geo package SHALL export bearing and distance functions
The system SHALL provide `bearing(pointA, pointB)` and `distance(pointA, pointB)` functions in `@accelint/geo` built on the existing geodesy dependency.

#### Scenario: Bearing calculation
- **WHEN** pointA is `[0.0, 0.0]` and pointB is `[1.0, 1.0]`
- **THEN** `geo.bearing(pointA, pointB)` returns initial bearing in degrees (0-360)

#### Scenario: Distance calculation
- **WHEN** pointA is `[0.0, 0.0]` and pointB is `[1.0, 0.0]`
- **THEN** `geo.distance(pointA, pointB)` returns great-circle distance in meters

#### Scenario: Antipodal points
- **WHEN** pointA is `[0.0, 0.0]` and pointB is `[0.0, 180.0]` (antipodal)
- **THEN** `geo.distance(pointA, pointB)` returns half Earth's circumference (~20,000 km)
- **THEN** `geo.bearing(pointA, pointB)` returns a valid bearing (90° or 270°)

#### Scenario: Antimeridian crossing
- **WHEN** pointA is `[179.0, 0.0]` and pointB is `[-179.0, 0.0]`
- **THEN** `geo.distance(pointA, pointB)` calculates shortest great-circle path across antimeridian
- **THEN** `geo.bearing(pointA, pointB)` returns correct bearing (~90°)

#### Scenario: Geodesic midpoint
- **WHEN** pointA is `[0.0, 0.0]` and pointB is `[10.0, 0.0]`
- **THEN** `geo.midpoint(pointA, pointB)` returns the point halfway along the great-circle path (`[5.0, 0.0]`)

### Requirement: Formatters package SHALL export formatBearing function
The system SHALL provide `formatBearing(degrees)` in `@accelint/formatters` that normalizes and formats bearing values with zero-padding and degree symbol.

#### Scenario: Positive bearing formatted
- **WHEN** input is 45 degrees
- **THEN** `formatBearing(45)` returns `"045°"`

#### Scenario: Negative bearing normalized
- **WHEN** input is -10 degrees
- **THEN** `formatBearing(-10)` returns `"350°"`

#### Scenario: Zero bearing formatted
- **WHEN** input is 0 degrees
- **THEN** `formatBearing(0)` returns `"000°"`

#### Scenario: Large bearing normalized
- **WHEN** input is 370 degrees
- **THEN** `formatBearing(370)` returns `"010°"`

### Requirement: MeasurementLayer SHALL render line, endpoints, and label
The system SHALL compose PathLayer (dashed line), ScatterplotLayer (endpoints), and TextLayer (label) as a controlled composite layer.

#### Scenario: Controlled layer renders from props
- **WHEN** `<measurementLayer pointA={[10.0, 20.0]} pointB={[11.0, 21.0]} showLabel={true} />` is rendered
- **THEN** system renders PathLayer with dashed line from pointA to pointB
- **THEN** system renders ScatterplotLayer with circles at pointA and pointB
- **THEN** system renders TextLayer at the geodesic midpoint computed by `geo.midpoint(pointA, pointB)`

#### Scenario: Antimeridian-crossing segment draws the short way
- **WHEN** `<measurementLayer pointA={[179.0, 0.0]} pointB={[-179.0, 0.0]} />` is rendered
- **THEN** each sublayer is configured with `wrapLongitude: true`
- **THEN** the line spans the 2° gap across the antimeridian rather than 358° around the map

#### Scenario: Non-finite points render nothing
- **WHEN** `<measurementLayer pointA={[NaN, 20.0]} pointB={[11.0, 21.0]} />` is rendered
- **THEN** system renders no sublayers and does not throw

#### Scenario: Label hidden
- **WHEN** `<measurementLayer pointA={[10.0, 20.0]} pointB={[11.0, 21.0]} showLabel={false} />` is rendered
- **THEN** system renders PathLayer and ScatterplotLayer
- **THEN** system does NOT render TextLayer

#### Scenario: Custom label override
- **WHEN** `getLabel={(pointA, pointB, units) => "Custom: 42 km"}` is provided
- **THEN** system calls `getLabel` with pointA, pointB, and the configured `units`
- **THEN** system renders TextLayer with custom label text
- **THEN** system ignores default label formatting

### Requirement: MeasurementTool SHALL wire hook and layer together
The system SHALL provide a convenience component that calls `useMeasurement(mapId)` and renders `MeasurementLayer` with the hook's state.

#### Scenario: Plug-and-play usage
- **WHEN** `<BaseMap><MeasurementTool mapId="main" /></BaseMap>` is rendered
- **THEN** the measurement store subscribes to `map:drag*` events for mapId "main" (once, shared with any other `useMeasurement("main")` instances)
- **THEN** system renders MeasurementLayer when pointA and pointB are set

#### Scenario: Style overrides forwarded
- **WHEN** `<MeasurementTool lineColor={[255, 0, 0]} endpointColor={[0, 255, 0]} />` is rendered
- **THEN** system passes lineColor and endpointColor to MeasurementLayer

### Requirement: Fiber registration SHALL enable JSX syntax
The system SHALL provide side-effect import at `@accelint/map-toolkit/deckgl/measurement-layer/fiber` that registers `MeasurementLayer` with deck.gl fiber.

#### Scenario: Fiber JSX renders
- **WHEN** developer imports `@accelint/map-toolkit/deckgl/measurement-layer/fiber`
- **WHEN** developer renders `<measurementLayer pointA={[10.0, 20.0]} pointB={[11.0, 21.0]} />`
- **THEN** system renders MeasurementLayer via deck.gl fiber

### Requirement: Measurement SHALL render within 60fps frame budget
The system SHALL complete measurement calculation and layer rendering in under 16.67ms to maintain 60fps.

#### Scenario: Single measurement performance
- **WHEN** user drags to update pointB
- **WHEN** system calculates distance and bearing via `geo.bearing()` and `geo.distance()`
- **WHEN** system updates MeasurementLayer with new props
- **THEN** total execution time is less than 16.67ms
