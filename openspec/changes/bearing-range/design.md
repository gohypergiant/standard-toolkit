 ## Context

### Current State
**map-toolkit** currently provides deck.gl layer components for displaying and editing shapes but lacks measurement tools. The existing infrastructure includes:
- BaseMap component with drag handlers via BaseMapContext
- Event-bus-based activation pattern (see `map-mode/store.ts`)
- deck.gl composite layer architecture (DisplayShapeLayer, DrawShapeLayer)
- @turf/turf utilities for geodesic calculations (distance, bearing, rhumbBearing)

**formatters** package contains stub implementations:
- `bearing()` in `src/bearing/index.ts` — returns "NOT IMPLEMENTED"
- `azimuth()` in `src/azimuth/index.ts` — returns "NOT IMPLEMENTED"

**Key files:**
- `packages/map-toolkit/src/deckgl/` — deck.gl layer components
- `packages/map-toolkit/src/base-map/` — BaseMapContext and drag handlers
- `packages/formatters/src/bearing/` and `src/azimuth/` — stub formatters

### Desired End State
After this change:
- A new `MeasurementLayer` deck.gl composite layer (controlled, renders line + endpoints + label from props)
- A `useMeasurement(mapId?)` hook providing interaction state and drag handlers
- A `MeasurementTool` component that wires the hook + layer together
- `@accelint/formatters` package exports working `formatBearing()` function (fills existing stub)
- `@accelint/geo` package exports `bearing()` and `distance()` geodesy functions
- Measurement activates via the hook's `start()` action, clears via `clear()`
- During measurement drag, pan is suppressed via `MapEvents.disablePan/enablePan`
- Measurement readout displays at line midpoint: "42.3 km / 22.8 NM | BRG: 321°"
- Per-mapId store pattern (via `createMapStore`) for multi-instance isolation

## Goals / Non-Goals

**Goals:**
- Provide interactive bearing-and-range measurement matching tactical C2 workflows
- Reuse existing bus-event and drag-handler patterns from map-toolkit
- Keep the layer within the 16.67ms frame budget (60fps target)
- Implement bearing/azimuth formatters as production-ready utilities

**Non-Goals:**
- Multi-segment measurement (polyline distance) — single two-point measurement only
- Rhumb-line bearing option — great-circle only for v1
- Measurement history or saved measurements — ephemeral display only
- Ruler UI chrome (scale divisions, tick marks) — simple line + text label

## Decisions

### Decision 1: Composite Deck.gl Layer + Hook Architecture
**Choice:** Implement as three parts:

**1. MeasurementLayer (controlled CompositeLayer):**
- Pure render layer - takes `pointA`, `pointB` and draws line + endpoints + label
- Controlled (pure function of props)
- Composes PathLayer (dashed line) + ScatterplotLayer (endpoints) + TextLayer (label)
- Props: `{ pointA, pointB, showLabel, getLabel, ...styleProps }`
- Can be used directly via fiber: `<measurementLayer pointA={a} pointB={b} />`
- Pure function of props (controlled)
- Composes **PathLayer** + **PathStyleExtension** (dashed line), **ScatterplotLayer** (endpoints), **TextLayer** (label)
- Can be used directly: `<measurementLayer pointA={a} pointB={b} />`

**2. useMeasurement hook (headless interaction):**
- Headless (no rendering)
- Subscribes to `map:drag*` events on the bus
- Updates per-mapId store with pointA/pointB
- Checks optional modifier key (Shift/Ctrl/Alt)
- Returns: `{ isMeasuring, pointA, pointB, distanceKm, bearingDeg, start, clear }`
- Usage: `const { pointA, pointB, start } = useMeasurement(mapId);`

**3. MeasurementTool component (convenience wrapper):**
- Wires `useMeasurement` hook + `MeasurementLayer` together
- Forwards props to layer (showLabel, units, styleProps)
- Passes modifier requirement to hook
- Simple plug-and-play: `<BaseMap><MeasurementTool mapId={id} showLabel /></BaseMap>`
- Internally: calls hook, renders layer with hook state

**Rationale:**
- **Separation of concerns**: layer renders, hook manages state, tool combines them
- **Flexibility**: use layer directly for custom interaction, or tool for plug-and-play
- **PathLayer + PathStyleExtension** enables dashed line rendering (LineLayer does NOT support dashes)
- **ScatterplotLayer** provides circular endpoint handles (visual feedback for drag points)
- **TextLayer** with SDF renders crisp measurement readout
- Controlled layer (pure function of props) matches grid-layers pattern
- Hook pattern matches draw-shape-layer structure (store/bus/mode)

**Alternatives Considered:**
- Single component handling both interaction and rendering — rejected because separation allows direct layer usage
- LineLayer for the path — rejected because it doesn't support dashed lines
- Layer handles interaction internally — rejected because it can't subscribe to BaseMap drag events

### Decision 2: Enhance BaseMap with Drag Events + Optional Modifier Key
**Choice:** 
- **Add drag events to BaseMap**: emit `map:dragStart`, `map:drag`, `map:dragEnd` on the bus (following existing `map:click`/`map:hover` pattern)
- **Include modifier keys in payload**: `{ id, info, event, coordinate, shiftKey, ctrlKey, altKey }`
- **MeasurementTool subscribes** via `useOn(MapEvents.dragStart, ...)` when active
- **Optional modifier requirement**: `requiresModifier?: 'shift' | 'ctrl' | 'alt'` prop (default: undefined = always capture)
- State lives in per-mapId store via `createMapStore`

**Rationale:**
- BaseMap already emits `click`/`hover` to the bus but NOT drag — this fills that gap
- Bus-based listening makes MeasurementTool plug-and-play: `<BaseMap><MeasurementTool /></BaseMap>` (no prop spreading)
- Modifier key support enables Shift+drag to measure while plain drag pans (better UX than mode-based blocking)
- `info.coordinate` is already unprojected [lon, lat] (deletes neo's `WebMercatorViewport.unproject`)
- Per-mapId store (like draw-shape-layer) enables multi-instance isolation
- Pattern matches how `handleClick` and `handleHover` work: call user callback, then emit to bus

**Implementation Impact:**
- **BaseMap enhancement** (small): add 3 emit calls in `handleDragStart/Drag/DragEnd` (after user callback, like click/hover)
- **MapEvents addition**: add `dragStart`, `drag`, `dragEnd` constants
- **Type addition**: add `MapDragEvent` payload type with modifier keys

**Alternatives Considered:**
- Require prop spreading (`dragHandlers` onto BaseMap) — rejected because it's not plug-and-play and breaks the bus pattern
- Mode-based only (suppress pan entirely when measuring) — rejected because modifier key allows simultaneous pan + measure
- Layer captures drag internally — rejected because child layers can't observe BaseMap drag props
- Global Zustand store — rejected because per-mapId pattern is the map-toolkit standard

### Decision 3: Great-Circle Distance and Bearing — Promote to @accelint/geo
**Choice:** Promote `bearing()` and `distance()` functions to `@accelint/geo`, built on geo's existing `geodesy` dependency (LatLonSpherical.initialBearingTo/distanceTo). Layer calls `geo.bearing()` and `geo.distance()`.

**Rationale:**
- @accelint/geo already depends on `geodesy` library — no new third-party dep
- Promotes geodesy out of map-toolkit into the correct home (geo package)
- Deletes neo's hand-rolled Haversine/atan2 math
- Great-circle is correct for global navigation (geodesic on WGS84 ellipsoid)

**Alternatives Considered:**
- Use `@turf/distance` and `@turf/bearing` directly — rejected because geo already has geodesy, and promotion demonstrates Core reuse
- Keep in map-toolkit — rejected because geodesy belongs in geo package

### Decision 4: Bearing Format Convention
**Choice:** Bearing displayed as 0-360° true north reference, formatted as `"123°"` (integer degrees, no decimals).

**Rationale:**
- Matches NTDS/C2 tactical display conventions (true bearing, not magnetic)
- Integer degrees are sufficient precision for visual map measurements
- The `formatters/bearing()` function will normalize negative bearings and format with degree symbol

**Alternatives Considered:**
- Magnetic bearing — rejected because magnetic declination varies by location and time
- Cardinal directions (NE, SW) — rejected as less precise; add as optional future enhancement

### Decision 5: Configurable Distance Units with Dual-Unit Default
**Choice:** Accept a `units` prop (type `DistanceUnit | DistanceUnit[]`) with default `['kilometers', 'nauticalmiles']`. Single unit displays as "42.3 km", dual displays as "42.3 km / 22.8 NM".

**Rationale:**
- Default dual display (km + NM) covers both maritime/air and land operations without configuration
- Single-unit mode via `units='kilometers'` for simplified readouts
- Uses `@accelint/constants/units` `DistanceUnit` type (already in map-toolkit)
- `DISTANCE_UNIT_SYMBOLS` provides standard abbreviations (km, NM, mi, m)
- Configurable units enable future support for statute miles, meters, feet

**Alternatives Considered:**
- Fixed dual display only — rejected because some use cases need single-unit readouts
- User toggle/dropdown — deferred to future work; prop-based configuration is simpler for v1
- Add statute miles now — deferred; can be added via `units='miles'` when needed

### Decision 6: Formatter Package Structure
**Choice:** Implement `formatBearing()` in `@accelint/formatters/bearing` (fills existing stub) returning formatted string (e.g., `"045°"` with 3-digit zero-padding). `azimuth()` remains a TODO stub (not used by this feature).

**Rationale:**
- Bearing formatter is needed for measurement readout
- Fills the existing `// TODO: implement bearing formatting functions` stub
- Azimuth formatter (cardinal direction mapping) is not required for this feature
- Single-purpose functions align with formatters package design (one function per directory)
- Uses `round` from `@accelint/math` for precision

**Alternatives Considered:**
- Combine bearing + azimuth into one function — rejected because they serve different purposes (numeric vs. cardinal)
- Implement both now — rejected as unnecessary scope expansion; azimuth can be added when needed

### Decision 7: Event Bus Namespace and Lifecycle
**Choice:** Use `'measurement'` namespace with full lifecycle events:
- `measurement:start` — user begins measurement (pointA set)
- `measurement:update` — pointB updated during drag
- `measurement:complete` — drag ended, both points final
- `measurement:clear` — measurement cleared

**Rationale:**
- `measurement` namespace is more intuitive than `bearing-range` (matches the layer name)
- Full lifecycle allows external UI to react (e.g., log panel, toast notifications)
- Follows map-toolkit's event naming convention (`map-mode:change:request`, etc.)
- Events carry `{ mapId, pointA, pointB }` payload for multi-instance isolation

**Alternatives Considered:**
- `bearing-range` namespace — rejected as too specific; measurement is the feature domain
- Only start/complete events — rejected because update events enable live readouts in external UI

### Decision 8: MeasurementTool Component Props
**Choice:** `MeasurementTool` accepts:
```typescript
type MeasurementToolProps = {
  mapId?: string;  // defaults to MapContext
  showLabel?: boolean;  // default true
  units?: DistanceUnit | DistanceUnit[];  // default ['kilometers', 'nauticalmiles']
  requiresModifier?: 'shift' | 'ctrl' | 'alt';  // default undefined (always capture)
  getLabel?: (pointA: [number, number], pointB: [number, number], units: DistanceUnit | DistanceUnit[]) => string;
  // style overrides forwarded to MeasurementLayer
  lineColor?: Color;
  endpointColor?: Color;
}
```

**Rationale:**
- `showLabel` prop allows consumers to hide the on-canvas label if they render measurement externally
- `units` prop configures distance display (single or dual units)
- `requiresModifier` enables Shift+drag (or Ctrl/Alt) to measure while plain drag pans — better UX than mode-based pan blocking
- Default undefined means always capture drag when active (mode-based, like draw-shape-layer)
- `getLabel` override enables custom formatting, receives units for consistency
- Default `getLabel` builds "42.3 km" (single) or "42.3 km / 22.8 NM" (dual) based on units prop
- Style overrides enable branding/theming without re-implementing the component
- `mapId` defaults to MapContext for convenience (like other map-toolkit components)

**Alternatives Considered:**
- No units prop, force getLabel override — rejected because unit selection is a common customization
- No modifier key support — rejected because Shift+drag allows simultaneous pan + measure (better than mode-only)
- Hardcode Shift — rejected because some apps may prefer Ctrl or Alt

### Decision 9: Fiber Registration and Exports
**Choice:** Provide fiber registration at `@accelint/map-toolkit/deckgl/measurement-layer/fiber` with:
- `extend({ MeasurementLayer })` 
- `declare global` JSX intrinsic `<measurementLayer>`
- Side-effect export in package.json

**Rationale:**
- Matches grid-layers fiber pattern (`deckgl/grid-layers/gars/fiber.ts`)
- Enables JSX syntax: `<measurementLayer pointA={a} pointB={b} />`
- Side-effect import ensures registration before usage

**Alternatives Considered:**
- No fiber registration — rejected because it's the map-toolkit standard for deck.gl layers
- Auto-register on layer import — rejected because side-effect imports should be explicit

## Risks / Trade-offs

### Risk: Drag Interaction Conflict with Other Layers
**Mitigation:** Pan suppression during measurement ensures clean interaction. If future layers also use drag handlers, implement activation state via bus events (only one tool active at a time).

### Risk: Label Overlap at High Zoom
**Mitigation:** Place label at line midpoint with deck.gl TextLayer's collision avoidance (billboard: true). If overlap occurs in practice, defer label placement refinement to a follow-up.

### Risk: Performance on Low-End Devices
**Mitigation:** BearingRangeLayer renders only one line + one label (minimal draw calls). Turf distance/bearing calculations are fast for single-point pairs. Frame-budget analysis: <1ms for coordinate conversion + calculation + layer update.

### Trade-off: No Measurement Persistence
**Rationale:** Ephemeral measurement keeps implementation simple. If users need saved measurements, a future feature can add shape creation from measurement (converting the line to a DrawShape).

### Trade-off: No Rhumb-Line Option
**Rationale:** Great-circle is correct for most C2 use cases. Rhumb-line can be added as a prop or mode toggle if users request it.

## Patterns to Follow

**From grid-layers (GARS/MGRS):**
- Multi-file structure: `index.ts`, `types.ts`, `constants.ts`, `events.ts`, `fiber.ts`
- CompositeLayer with `static override layerName = 'MeasurementLayer'`
- `renderLayers()` composes PathLayer + ScatterplotLayer + TextLayer
- `Broadcast.getInstance<MeasurementEvent>()` for bus events
- Test files: `*.test.ts`, `*.integration.test.ts`, `*.stories.tsx`, `*.docs.mdx`

**From draw-shape-layer:**
- Per-mapId store via `createMapStore<MeasurementState, MeasurementActions>`
- Hook returns `{ isMeasuring, pointA, pointB, start, clear, dragHandlers }`
- map-mode integration: `requestModeChange('measuring')`, cursor: `'crosshair'`
- Pan suppression: `useEmit(MapEvents.disablePan/enablePan)`

**From text-settings:**
- Reuse `DEFAULT_TEXT_STYLE` + `SDF_FONT_SETTINGS`
- Include `characterSet: TOOLTIP_CHARACTER_SET` for `°` glyph

**From shapes/shared/constants:**
- Reuse `DASH_ARRAYS.dashed` for line pattern

## Patterns to Avoid

- Hand-rolling geodesy (Haversine, atan2) — use geo's geodesy engine
- Manual canvas pointer handling + `WebMercatorViewport.unproject` — use BaseMap drag handlers
- Global Zustand store — use per-mapId createMapStore
- Hardcoded white colors — use design-foundation tokens + useTheme()
- Inline SDF fontSettings — compose DEFAULT_TEXT_STYLE
- Missing characterSet for special glyphs — always include TOOLTIP_CHARACTER_SET

## Migration Plan

**Deployment:** This is a new feature with no breaking changes.

1. Publish `@accelint/geo` with `bearing()` and `distance()` functions (minor bump)
2. Publish `@accelint/formatters` with implemented `formatBearing()` formatter (minor bump)
3. Publish `@accelint/map-toolkit` with MeasurementLayer + useMeasurement + MeasurementTool (minor bump)
4. Update apps/next demo to showcase measurement tool via Storybook story

**Package.json exports:**
```json
{
  "exports": {
    "./deckgl/measurement-layer": "./dist/deckgl/measurement-layer/index.js",
    "./deckgl/measurement-layer/fiber": "./dist/deckgl/measurement-layer/fiber.js",
    "./deckgl/measurement-layer/types": "./dist/deckgl/measurement-layer/types.js"
  },
  "sideEffects": [
    "./src/deckgl/measurement-layer/fiber.ts",
    "./dist/deckgl/measurement-layer/fiber.js"
  ]
}
```

**Acceptance Criteria:**
- Fiber registration works: `<measurementLayer pointA={a} pointB={b} />` renders
- Story compiles and runs: `bearing-range.stories.tsx` demonstrates QuickMeasure + Readout
- All events emit with correct payload: `measurement:start/update/complete/clear`
- MeasurementTool `showLabel` prop toggles label visibility
- Pan is suppressed during drag, restored after
- `°` glyph renders correctly (characterSet includes U+00B0)
- Verification gate passes: `pnpm build && pnpm test && pnpm lint && pnpm format`

**Rollback Strategy:** If issues arise, consumers can simply not activate the measurement tool (no migration required).

## Open Questions

No unresolved questions.
