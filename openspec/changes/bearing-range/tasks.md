# Bearing-Range Measurement Implementation Tasks

## 1. Geodesy Functions in @accelint/geo [PKG:geo]

- [x] 1.1 Add `bearing(pointA: [number, number], pointB: [number, number]): number` function using geodesy's `LatLonSpherical.initialBearingTo()`
  - Input: two [lon, lat] coordinate pairs
  - Output: initial bearing in degrees (0-360)
  - Handle antipodal points and antimeridian crossing correctly
  - Add JSDoc with @param, @returns, @example
  - Test: Unit tests with known coordinate pairs (north, northeast, southwest), antipodal points, antimeridian crossing, zero-distance edge case

- [x] 1.2 Add `distance(pointA: [number, number], pointB: [number, number]): number` function using geodesy's `LatLonSpherical.distanceTo()`
  - Input: two [lon, lat] coordinate pairs
  - Output: great-circle distance in meters
  - Add JSDoc with @param, @returns, @example
  - Test: Unit tests with known distances, antipodal points, zero-distance edge case

- [x] 1.3 Export from package barrel and update package.json exports
  - Add to `src/index.ts` (regenerate via `pnpm index` after adding functions)
  - Test: Import and use functions in a test consumer module

## 2. Bearing Formatter in @accelint/formatters [PKG:formatters]

- [x] 2.1 Implement `formatBearing(degrees: number): string` in `src/bearing/index.ts`
  - Replace "NOT IMPLEMENTED" stub
  - Normalize negative and >360 values using modulo: `(degrees % 360 + 360) % 360`
  - Round to integer using `@accelint/math/round`
  - Zero-pad to 3 digits
  - Append degree symbol (°)
  - Add JSDoc with @param, @returns, @example
  - Test: Unit tests for positive bearing (45 → "045°"), negative bearing (-10 → "350°"), zero (0 → "000°"), large bearing (370 → "010°")

- [x] 2.2 Add `formatDistance(meters: number, units: DistanceUnit | DistanceUnit[]): string` helper function
  - Accept meters and target unit(s) from `@accelint/constants/units`
  - Convert meters to kilometers (÷1000) or nautical miles (÷1852)
  - Format with 1 decimal place
  - Single unit mode: "42.3 km"
  - Dual unit mode: "42.3 km / 22.8 NM"
  - Use `DISTANCE_UNIT_SYMBOLS` for abbreviations
  - Add JSDoc with @param, @returns, @example
  - Test: Unit tests for single unit (km, NM), dual units, zero distance edge case

## 3. BaseMap Drag Events [PKG:map-toolkit]

- [x] 3.1 Add drag event types to `src/base-map/events.ts`
  - Add `dragStart`, `drag`, `dragEnd` constants to `MapEvents`
  - Define `MapDragEvent` type with `{ id: string, coordinate: [number, number], shiftKey: boolean, ctrlKey: boolean, altKey: boolean }`
  - Update `MapEventPayloads` type map
  - Test: Type-check compiles without errors

- [x] 3.2 Emit drag events from BaseMap handlers in `src/base-map/base-map.tsx`
  - In `handleDragStart`: after calling user callback, emit `MapEvents.dragStart` with `{ id, coordinate: info.coordinate, shiftKey, ctrlKey, altKey }`
  - In `handleDrag`: emit `MapEvents.drag`
  - In `handleDragEnd`: emit `MapEvents.dragEnd`
  - Extract modifier keys from `event` parameter
  - Test: Integration test with BaseMap, subscribe to drag events, verify events fire with correct payload on drag interaction

## 4. Measurement Store and Hook [PKG:map-toolkit]

- [x] 4.1 Create measurement store in `src/deckgl/measurement-layer/store.ts`
  - Define `MeasurementState` type: `{ pointA: [number, number] | null, pointB: [number, number] | null, isMeasuring: boolean }`
  - Define `MeasurementActions` type: `{ start: (pointA: [number, number]) => void, updateEnd: (pointB: [number, number]) => void, complete: () => void, clear: () => void }`
  - Use `createMapStore<MeasurementState, MeasurementActions>(defaultState, actions)`
  - Test: Unit tests for store actions (start sets pointA, updateEnd sets pointB, clear resets state)

- [x] 4.2 Implement `useMeasurement(mapId?: string)` hook in `src/deckgl/measurement-layer/use-measurement.ts`
  - Subscribe to `map:dragStart`, `map:drag`, `map:dragEnd` events via `useOn`
  - Check `requiresModifier` prop against event modifier keys (if set, only proceed when modifier is pressed)
  - On dragStart: call `store.start(coordinate)`, emit `measurement:start`, emit `map:disablePan`
  - On drag: call `store.updateEnd(coordinate)`, emit `measurement:update`
  - On dragEnd: call `store.complete()`, emit `measurement:complete`, emit `map:enablePan`
  - Return `{ isMeasuring, pointA, pointB, distanceKm, distanceNM, bearingDeg, start, clear }`
  - Calculate distanceKm/distanceNM using `geo.distance()` and conversion factors
  - Calculate bearingDeg using `geo.bearing()`
  - Test: Integration test with mocked drag events, verify state updates and bus events fire correctly, test modifier key filtering

## 5. MeasurementLayer Composite Layer [PKG:map-toolkit]

- [x] 5.1 Implement `MeasurementLayer` in `src/deckgl/measurement-layer/measurement-layer.ts`
  - Extend `CompositeLayer<MeasurementLayerProps>`
  - Props: `{ pointA, pointB, showLabel, getLabel, units, lineColor, endpointColor }`
  - `static override layerName = 'MeasurementLayer'`
  - `renderLayers()` returns array of PathLayer + ScatterplotLayer + TextLayer (conditionally)
  - PathLayer: uses PathStyleExtension for dashed line, `DASH_ARRAYS.dashed` from shapes/shared/constants
  - ScatterplotLayer: circular endpoints at pointA and pointB with configurable endpointColor
  - TextLayer: label at line midpoint using `DEFAULT_TEXT_STYLE` + `SDF_FONT_SETTINGS`, `characterSet: TOOLTIP_CHARACTER_SET` (includes °), conditionally rendered if `showLabel={true}`
  - Default `getLabel` implementation: calls `formatDistance()` and `formatBearing()`, returns "X km / Y NM | BRG: ZZZ°" or "X km | BRG: ZZZ°"
  - Add comprehensive JSDoc
  - Test: Unit tests for renderLayers output (verify PathLayer, ScatterplotLayer, TextLayer sublayers exist with correct props), test showLabel=false hides TextLayer, test custom getLabel override

- [x] 5.2 Add fiber registration in `src/deckgl/measurement-layer/fiber.ts`
  - Import `MeasurementLayer` and call `extend({ MeasurementLayer })`
  - Add JSX intrinsic declaration: `declare global { namespace JSX { interface IntrinsicElements { measurementLayer: ... } } }`
  - Test: Render `<measurementLayer pointA={[10, 20]} pointB={[11, 21]} />` in a test, verify it renders without errors

- [x] 5.3 Update package.json exports for measurement-layer
  - Add `"./deckgl/measurement-layer"`, `"./deckgl/measurement-layer/fiber"`, `"./deckgl/measurement-layer/types"` exports
  - Add fiber side-effect to `sideEffects` array
  - Test: Import each export path in a test module, verify no import errors

## 6. MeasurementTool Convenience Component [PKG:map-toolkit]

- [x] 6.1 Implement `MeasurementTool` component in `src/deckgl/measurement-layer/measurement-tool.tsx`
  - Props: `{ mapId?, showLabel?, units?, requiresModifier?, getLabel?, lineColor?, endpointColor? }`
  - Call `useMeasurement(mapId)` hook with requiresModifier
  - Render `MeasurementLayer` with hook state (pointA, pointB) and forwarded style props
  - Only render layer when `isMeasuring={true}` and pointA/pointB are set
  - Add JSDoc with @example showing plug-and-play usage: `<BaseMap><MeasurementTool /></BaseMap>`
  - Test: Integration test with BaseMap, render MeasurementTool, trigger drag events, verify MeasurementLayer renders with correct props, verify modifier key filtering works

## 7. Storybook Story and Documentation [PKG:map-toolkit]

- [x] 7.1 Create `src/deckgl/measurement-layer/measurement-layer.stories.tsx`
  - Story 1: "Default Measurement" — drag to measure with dual units (km + NM)
  - Story 2: "Single Unit (Kilometers)" — `units='kilometers'`
  - Story 3: "Modifier Key Required" — `requiresModifier='shift'`, instructions to hold Shift
  - Story 4: "Custom Label" — `getLabel` override showing different format
  - Story 5: "Direct Layer Usage" — render `<measurementLayer>` via fiber with static pointA/pointB
  - Test: Visual regression test with Playwright (capture screenshot of measurement readout)

- [x] 7.2 Add JSDoc examples to all exported functions/components
  - Ensure bearing(), distance(), formatBearing(), formatDistance(), MeasurementLayer, useMeasurement, MeasurementTool all have @example blocks
  - Test: Run `pnpm run audit:docblocks` (non-blocking pre-push check)

## 8. Integration Tests and Multi-Instance Isolation [PKG:map-toolkit]

- [x] 8.1 Add integration test for multi-instance isolation in `src/deckgl/measurement-layer/measurement-layer.integration.test.ts`
  - Render two BaseMap instances with different mapIds ('alpha', 'beta')
  - Add MeasurementTool to each with respective mapId
  - Trigger drag events on 'alpha' map, verify only 'alpha' measurement updates
  - Trigger drag events on 'beta' map, verify only 'beta' measurement updates
  - Verify per-mapId store isolation
  - Test: Assertions verify state isolation (useMeasurement('alpha') returns different values than useMeasurement('beta'))

- [x] 8.2 Add pan suppression integration test
  - Render BaseMap with MeasurementTool
  - Start measurement drag
  - Verify `map:disablePan` event emitted
  - Complete measurement drag
  - Verify `map:enablePan` event emitted
  - Test: Assertions verify pan events fire in correct order

## 9. Verification Gate and Changesets [ALL PACKAGES]

- [x] 9.1 Run full verification gate
  - Run `pnpm build` from root — fix any type errors (use tsconfig.dist.json for map-toolkit type-checking if needed)
  - Run `pnpm test` — ensure all new tests pass
  - Run `pnpm lint` — fix any lint errors
  - Run `pnpm format` — fix any formatting issues
  - Run `pnpm index` — regenerate barrel exports
  - Test: All commands pass without errors

- [x] 9.2 Create changesets for affected packages
  - Run `pnpm changeset` for @accelint/geo (minor bump: new bearing/distance functions)
  - Run `pnpm changeset` for @accelint/formatters (minor bump: implemented formatBearing)
  - Run `pnpm changeset` for @accelint/map-toolkit (minor bump: new MeasurementLayer + useMeasurement + MeasurementTool)
  - Changeset summaries describe user-facing changes clearly
  - Test: `.changeset/` directory contains 3 changeset files with correct package names and bump types

## Parallelization Strategy

### Dependencies (Must Complete First)

- **Tasks 1-2** must complete before task 3 (BaseMap needs geo functions and formatters)
- **Tasks 1-3** must complete before task 4 (measurement store/hook depends on geo functions and drag events)
- **Task 4** must complete before tasks 5-6 (layer and tool depend on the hook)

### Independent tasks (can run in parallel):

- **Task 1** (geo functions) and **Task 2** (formatters) are independent → can implement simultaneously
- **Task 5** (MeasurementLayer) and **Task 6** (MeasurementTool) can start in parallel once Task 4 completes (layer and tool are independent, both depend only on the hook)
- **Task 7** (stories/docs) and **Task 8** (integration tests) are independent → can implement simultaneously after tasks 5-6 complete

### Sequential dependencies:

- Task 3 (BaseMap drag events) must complete before Task 4 because the hook subscribes to drag events
- Task 4 (store/hook) must complete before Task 5 and Task 6 because both layer and tool depend on the hook

### Critical path:

Task 1 → Task 4 → Task 5 → Task 9 (geo functions are needed by the hook, hook is needed by the layer, layer is needed for final verification)

### Recommended implementation order:

1. Implement **Tasks 1 and 2 in parallel** (geo functions + formatters — independent foundation work)
2. Implement **Task 3** (BaseMap drag events)
3. Implement **Task 4** (measurement store/hook — depends on 1, 2, 3)
4. Implement **Tasks 5 and 6 in parallel** (layer + tool — both depend only on task 4)
5. Implement **Tasks 7 and 8 in parallel** (stories/docs + integration tests — independent verification work)
6. Implement **Task 9** (verification gate + changesets — must be last)