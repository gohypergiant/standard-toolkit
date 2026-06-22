# @accelint/map-toolkit

## 5.2.0

### Minor Changes

- fdea8e2: 2.5D view now allows right click & drag to pitch and rotate the camera. default pitch was updated to 60 degrees instead of 45 degrees. The pitch is overridable via the `pitch` property when initializing camera state (`initializeCameraState`) or by emitting a `setPitch` event while in 2.5D. Pitch is clamped to the renderable range, and the maximum is exported as the `MAX_PITCH` constant from `@accelint/map-toolkit/camera` so consumers can bound their own pitch UI without hardcoding the value.

### Patch Changes

- 0b97542: Fix the rotate-handle connector stem inheriting the shape's line color while editing. The `rotate-stem` guide is edit chrome, so it now renders with the bounding-box line color/width (`bboxLineColor`/`bboxLineWidth`) like the bounding box itself, independent of the shape's own `lineColor`.
- 9b38ec2: Mark `radashi` as external in the build instead of bundling it. With `unbundle` on, the optional `radashi` dependency was inlined and its import rewritten to a `node_modules/.pnpm/radashi@…/…` store path. Bundlers that reject pnpm store paths (e.g. Turbopack) failed to resolve every `@accelint/map-toolkit` subpath with an "Invalid symlink" error in consuming apps. `radashi` is already an `optionalDependency`, so emitting a bare `radashi` specifier resolves cleanly from the consumer's `node_modules`.
- Updated dependencies [a76da93]
  - @accelint/geo@0.6.1

## 5.1.0

### Minor Changes

- 384b42f: Adds optional type generics (`Mode`, `Owner`) to `useMapMode` for narrowing the `mode` value and `requestModeChange` arguments. `UseMapModeReturn` is now generic as well (defaults preserve existing behavior).

### Patch Changes

- 8dc37e9: Fix `BaseMap` runtime error "Style is not done loading." when `defaultView='3D'` (globe projection). Projection is now applied via `setProjection` after MapLibre's style has loaded, instead of being passed as the initial `projection` prop to `react-map-gl/maplibre`.

## 5.0.0

### Major Changes

- c9952a6: **Breaking:** Reworks how `DisplayShapeLayer` renders hover and select fill states. The behavior of `selectedShapeId`, hover state, and the `DISPLAY_SELECTION` / `DISPLAY-hover` sublayer ids has changed. Adds optional accessor props for overriding the fill color of the active feature.

  ### Breaking changes
  - **Removed `SHAPE_LAYER_IDS.DISPLAY_SELECTION`.** The selection-overlay sublayer no longer exists, and its id is no longer exported from `@accelint/map-toolkit/deckgl/shapes`. Any code that referenced this constant for picking-info filtering, layer-id matching, or debug overlays must be updated. The hover sublayer (which had no exported constant; its id was `${layerId}-${SHAPE_LAYER_IDS.DISPLAY}-hover`) is also gone.
  - **Default fill-color rendering for selected and hovered shapes changed.** Previously the active feature's fill was produced by stacking a separate overlay sublayer on top of the main fill, with material-based lighting brightening the result on 3D extruded shapes. Now the main layer's `getFillColor` accessor returns a brightened color directly per feature, mirroring the existing `getLineColor` behavior. Pixel-level output differs in four ways:
    - No more alpha-blending stack (the active feature's color is the literal RGBA returned by the accessor; it isn't blended through the dimmed main fill).
    - No more 3D material-lighting variation across surface normals — extruded side faces no longer pick up extra brightness at oblique angles.
    - The brightening factor (`1.4×` for "hovered or selected", `1.7×` for "both") is applied to the un-dimmed base color rather than the `applyBaseOpacity`-reduced base, so active features read more vividly against their dimmed neighbors.
    - The active fill's alpha is scaled by a new `ACTIVE_FILL_OPACITY` constant (0.5). Curtain wall hover/select previously used `OVERLAY_FILL_OPACITY` (0.25) — bumped to 0.5 so polygon and curtain active states share the same opacity, and so the active feature reads more vividly without rendering as a solid block on top of the basemap. The internal helper `applyOverlayOpacity` was renamed to `applyActiveOpacity` and `OVERLAY_FILL_OPACITY` to `ACTIVE_FILL_OPACITY` to reflect the new role; both were internal-only.

  ### Migration
  - Replace any `SHAPE_LAYER_IDS.DISPLAY_SELECTION` reference with `SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT` (if you wanted the selection outline) or `SHAPE_LAYER_IDS.DISPLAY` (if you wanted the layer the active feature now lives on). If you were filtering picking events by sublayer id, the active-fill case is now handled by the main layer.
  - If you had visual regression snapshots or color-sensitive tests on selected/hovered shapes, regenerate them. The new colors are intentional and should read more clearly, but they are different.
  - If you depended on the 3D material-lighting cue specifically, set `getHoverFillColor` / `getSelectFillColor` to a brighter color of your choosing, or file an issue describing the use case.

  ### Added
  - **`getHoverFillColor`** prop: `(feature: ShapeFeature) => Rgba255Tuple`. When set, replaces the default brightening on the hovered feature for: polygon fills, unstyled point fills, and the curtain wall fill of elevated LineStrings (when `enableElevation` is on). The returned RGBA is used verbatim — no overlay-opacity scaling. No effect on icon-rendered points or non-elevated LineStrings.
  - **`getSelectFillColor`** prop: same shape and reach, applied when a feature is selected. The selection outline color is unaffected and is still driven by `highlightColor`.
  - When a shape is both hovered and selected and both overrides are set, `getHoverFillColor` wins.

### Minor Changes

- 999bfbf: Adds a `mapLibreOptions` prop to `BaseMap` that forwards additional MapLibre `MapOptions` (e.g. `transformRequest`, `maxBounds`, `minZoom`/`maxZoom`, `locale`, `interactive`, `cooperativeGestures`) to the underlying map instance.

  The most common use is `transformRequest` for rewriting tile URLs through a proxy, adding auth headers, or resolving `mapbox://` URIs against a self-hosted Mapbox-compatible service.

  ```tsx
  <BaseMap
    id={MAIN_MAP_ID}
    styleUrl={MAPBOX_STYLE_URL}
    mapLibreOptions={{
      transformRequest: (url) =>
        url.startsWith("mapbox://")
          ? {
              url: url.replace(
                "mapbox://",
                "https://tiles.internal.example.com/",
              ),
            }
          : { url },
      maxBounds: [
        [-130, 20],
        [-60, 55],
      ],
      cooperativeGestures: true,
    }}
  />
  ```

  Keys BaseMap manages internally are silently stripped before being applied: camera/view state (`container`, `center`, `bounds`, `fitBoundsOptions`, `zoom`, `pitch`, `bearing`, `projection`, `maxPitch`), gestures reserved for Deck.gl picking and the camera state machine (`doubleClickZoom`, `dragRotate`, `pitchWithRotate`, `rollEnabled`), the WebGL context (`canvasContextAttributes`), and keys already exposed as dedicated BaseMap props (`boxZoom`, `style`).

- 3fe824d: Refresh the bounding-box and rotation-handle visuals for shape editing.
  - Rotation handles for rectangles and ellipses now lock to the most-northern edge / axis endpoint at edit-session start and stay attached to that shape-local point through every gesture in the session — the handle starts on the visible top of the shape and rides along with rotations rather than hopping back to the new geographic top after each rotate. The lock resets when a different shape is opened for editing.
  - The polygon and line bounding box now renders with a dashed, muted line and a small outward buffer between the box and the shape so vertex handles and scale handles can't visually overlap. Scale corner handles, the rotate handle, and vertex handles each use a distinct color (turquoise / amber / white) so the three affordances are easy to tell apart.
  - The polygon and line bounding box now stays aligned with the shape across rotations — it tracks cumulative rotation since edit-session start and renders as an oriented bounding box rotated to match, instead of snapping back to a north-aligned bounding box after each rotate. Non-uniform scaling on a rotated polygon/line now operates in the polygon's local frame, so dragging a corner stretches the shape along its own axes rather than world X/Y (which previously sheared rotated polygons into slivers).
  - `EditShapeLayer` now accepts a `style` prop covering the full edit-handle and bounding-box surface — fill color, outline color, and radius for each of the three handle roles (`vertex`, `scale`, `rotate`), plus `editHandleStrokeWidth`, `editHandleOutline`, `bboxLineColor`, `bboxLineWidth`, and `bboxDashArray`. Each field is independently overridable; omitted fields use the package defaults.

  **Note for maintainers:** The oriented-bounding-box rotation/scale work reaches into `@deck.gl-community/editable-layers`' private `ScaleMode` fields (`_isScaling`, `_cornerGuidePoints`, `_selectedEditHandle`, `_geometryBeingScaled`, `_getOppositeScaleHandle`, `_getUpdatedData`, `_cursor`) to keep the scale origin stable through a rotated drag. The cast boundary is centralized in `modes/utils/scale-mode-internals.ts`, but the field names are pinned to the current upstream internals. If `@deck.gl-community/editable-layers` renames or removes any of these, the oriented scaling features break silently (TypeScript can't help — the contract is defined locally, not upstream). Treat any minor-version bump of that dependency as a behavioral regression risk and verify polygon/line rotate+scale manually.

## 4.1.0

### Minor Changes

- 5d224fb: Fix rotated ellipses being stretched into non-ellipse shapes during edit. Ellipses now use a new `'ellipse-transform'` edit mode (`EllipseTransformMode` + `EllipseScaleMode`) that places scale handles on the curve at the four axis endpoints (where the major and minor axes meet the boundary), projects axis-endpoint drags onto the dragged axis in Mercator space, and regenerates the polygon parametrically — so a rotated ellipse stays a clean rotated ellipse through any scale gesture. Hold Shift while dragging an axis endpoint to scale both axes uniformly (preserve aspect ratio).

  The rotate handle for ellipses is repositioned outside whichever axis endpoint is currently most-northern, with a short connector stem extending outward along that axis (perpendicular to the curve's tangent at that point). The same connector-stem treatment is also applied to the rectangle rotate handle in this release: rectangles' rotate handle now sits outside the most-northern edge with a stem perpendicular to that edge in Mercator space, replacing the bare on-edge placement that shipped with `'rectangle-transform'`. Both stems use the same fixed geographic length matching `@deck.gl-community`'s `RotateMode` connector formula, so the rotate handles read consistently across rectangle and ellipse at any zoom level.

  **Note for consumers:** the edit-mode value the store assigns to an `EllipseShape` changes from `'bounding-transform'` to `'ellipse-transform'`. If you read `editingState.editMode` and compare against `'bounding-transform'` for an ellipse, update those checks to also accept `'ellipse-transform'` (or rely on `getEditModeForShape` / `useEditShape` to pick the right mode for you).

- 11ac643: Tightened bus event payload types to satisfy `@accelint/bus`'s `StructuredCloneable` constraint, and tightened `useDrawShape().draw()` to reject undrawable shape types.
  - **Added `BusCloneable<T>`** (re-exported from `@accelint/map-toolkit/deckgl/shapes`): type-level helper that lets event payloads carrying GeoJSON `Feature`/`Shape` data satisfy the bus's `StructuredCloneable` constraint. GeoJSON data is cloneable at runtime but lacks the index signature that type-fest's `StructuredCloneable` requires of plain object types; `BusCloneable<T>` adds that signature via intersection. Use it when defining custom event payloads that carry shape data.
  - **Added `DrawableShapeType`** (re-exported from `@accelint/map-toolkit/deckgl/shapes`): `Exclude<ShapeFeatureType, 'WagonWheel'>`. Wagon wheels can't be interactively drawn — they need additional metadata (spokes, orientation, range rings) that a draw interaction can't collect, so they're constructed programmatically and edited via the EditShapeLayer.
  - **Narrowed `useDrawShape().draw()`** parameter from `ShapeFeatureType` to `DrawableShapeType`. This catches the previously unguarded potential runtime crash where `draw('WagonWheel')` would pass `undefined` to deck.gl. Callers that already pass concrete enum values (`ShapeFeatureType.Circle`, etc.) are unaffected; callers passing an arbitrary `ShapeFeatureType` will need to narrow to `DrawableShapeType` or handle the wagon-wheel case separately.
  - Cleared the related TypeScript errors in `useBus<EditShapeEvent>`, `useBus<DrawShapeEvent>`, and the corresponding broadcast/store sites.

- 5d224fb: Fix rotated rectangles distorting into parallelograms during edit. Rectangles now use a new `'rectangle-transform'` edit mode (`RectangleTransformMode` + `RectangleScaleMode`) that places scale handles at the rectangle's actual rotated corners and projects corner drags onto the rectangle's local edges in Mercator space, so rotation is preserved through any scale gesture. The rotate handle now sits on the rectangle's currently-northern edge midpoint instead of the axis-aligned bbox. Hold Shift while dragging a corner to scale uniformly (preserve aspect ratio) - same Shift behavior as before.

  **Note for consumers:** the edit-mode value the store assigns to a `RectangleShape` changes from `'bounding-transform'` to `'rectangle-transform'`. If you read `editingState.editMode` and compare against `'bounding-transform'` for a rectangle, update those checks to also accept `'rectangle-transform'` (or rely on `getEditModeForShape` / `useEditShape` to pick the right mode for you).

- a23674d: Pressing ESC while editing a shape now cancels editing. Previously the editable-layers library only honored Escape in draw modes — transform/translate/rotate/scale modes ignored it.

### Patch Changes

- b3db30f: Draw shapes layer no longer shows stale tooltip until first mouse event (bug) on subsequent draw actions.

## 4.0.0

### Major Changes

- 9819890: Refactor CoffinCornerExtension to a pure rendering primitive

  The coffin corner store (`coffinCornerStore`), hook (`useCoffinCorner`), layer registry, and domain events have been removed. The extension now accepts entity IDs directly as props — selection policy belongs in the consuming application (e.g. via SelectionManager).

  **Removed exports:**
  - `useCoffinCorner`, `UseCoffinCornerReturn`, `UseCoffinCornerOptions`
  - `coffinCornerStore`, `clearSelection`, `getSelectedEntityId`, `getHoveredEntityId`
  - `registerCoffinCornerLayer`, `unregisterCoffinCornerLayer`, `defaultGetEntityId`
  - `CoffinCornerEvents`, `CoffinCornerEvent`, `CoffinCornerEventType`
  - `CoffinCornerSelectedEvent`, `CoffinCornerDeselectedEvent`, `CoffinCornerHoveredEvent`

  **New props on `CoffinCornerExtension`:**
  - `selectedEntityIds: ReadonlySet<EntityId>` — replaces `selectedEntityId`
  - `hoveredEntityIds: ReadonlySet<EntityId>` — replaces `hoveredEntityId`

  **Removed props:**
  - `selectedEntityId` — use `selectedEntityIds` with a Set instead
  - `hoveredEntityId` — use `hoveredEntityIds` with a Set instead

### Minor Changes

- 210f52d: Add rubber band zoom

## 3.2.0

### Minor Changes

- bae93dc: Add `originalShape` to edit store for reliable cancel/revert and emit `shapes:feature-editing` events during drag operations

### Patch Changes

- 11fe8ce: fix: prevent DrawShapeLayer from breaking map viewport sync on mount

  `setDrawDistanceUnit` was calling `drawStore.set()` on mount even when not
  actively drawing. This triggered a re-render that raced with deck.gl's async
  device initialization, causing `MapboxOverlay.setProps` to overwrite the
  wrapped `onLoad` callback that registers `watchMapMove`. Without
  `watchMapMove`, the deck viewport stayed frozen at the initial zoom and
  pan/zoom picking coordinates were wrong.

  The fix guards `setDrawDistanceUnit` to only update the store when a drawing
  is active (`activeShapeType` is set).

## 3.1.1

### Patch Changes

- 5554161: fix tsdown config for build re: react-dom/client subpath

## 3.1.0

### Minor Changes

- 455d760: Add WagonWheel shape type with MultiPolygon geometry support
  - New `WagonWheel` shape type with center, radius, spokes, orientation, and range rings
  - New `locked-bounding-transform` edit mode for uniform scaling (maintains circular aspect ratio)
  - Circle property recomputation during drag for Circle and WagonWheel shapes
  - Rotation angle tracking on feature properties during rotate drag
  - MultiPolygon label positioning for wagon wheel shapes
  - Distance unit support for circle radius computation during drawing
  - Shape duplication support for WagonWheel (center offset, property preservation)

- bf43090: Add MGRS and GARS coordinate grid layers for deck.gl maps.
  - Renders military grid reference system (MGRS) global area reference system (GARS)
  - Configurable precision levels, dynamic zoom-based visibility
  - Cell labels, and event bus integration for hover/click interactions

- 023e204: Add `minElevation` support for 3D shapes. Polygon-type shapes render as floating slabs between `minElevation` and `maxElevation`. LineString curtains and Point indicator lines drop to `minElevation` instead of ground level.
- f44059b: Added `HtmlOverlayWidget` for rendering projected React elements as HTML overlays on DeckGL maps.
  - `HtmlOverlayWidget` — a DeckGL widget that projects React children onto the map viewport using geographic coordinates, with configurable overflow margin, z-index, and support for custom overlay rendering via `onCreateOverlay`/`onRenderOverlay` callbacks.
  - `HtmlOverlayItem` — a positioning component that uses CSS `transform: translate()` for smooth, jitter-free overlay placement during zoom.
  - `useHtmlOverlay` — a React hook that manages widget lifecycle and renders overlay content through a React portal, keeping React's reconciliation in control of the overlay DOM.
  - Pass `widgets` prop through `BaseMap` to DeckGL.

## 3.0.0

### Major Changes

- fa05228: Fix viewport size display to use SI/ICAO-compliant unit symbols instead of uppercased abbreviations. For example, `km` instead of `KM`, `m` instead of `M`. Nautical miles changed from `nm` to `NM` per ICAO/IMO convention.

  ### Breaking changes

  **New peer dependency:** `@accelint/constants` is now required.

  **Removed exports** (from `@accelint/map-toolkit/viewport`):
  - `DISTANCE_UNIT_ABBREVIATIONS` → use `DISTANCE_UNIT_SYMBOLS` from `@accelint/constants/units`
  - `DistanceUnitAbbreviation` type → use `DistanceUnitSymbol` from `@accelint/constants/units`
  - `DistanceUnit` type → use `DistanceUnit` from `@accelint/constants/units`
  - `SupportedDistanceUnit` type → use `DistanceUnitSymbol` from `@accelint/constants/units`
  - `getDistanceUnitFromAbbreviation()` → use `DISTANCE_UNIT_BY_SYMBOL[symbol]` from `@accelint/constants/units`
  - `getDistanceUnitAbbreviation()` → use `DISTANCE_UNIT_SYMBOLS[unit]` from `@accelint/constants/units`

  **Symbol value changes:** Unit symbols are now SI-compliant though nautical miles uses the ICAO/IMO convention of NM. If you were matching on string values, update accordingly:
  - `'nm'` → `'NM'` (nautical miles)

### Minor Changes

- b3de1bb: Add radius label on hover for circle shapes in `DisplayShapeLayer`. When hovering a circle, the radius is displayed in the configured `unit` (defaults to nautical miles). The label positions relative to the shape's text label: below it when `showLabels` is `'always'` or `'hover'`, and in its place when `showLabels` is `'never'`. Also adds the `unit` prop to `DisplayShapeLayerProps` for configuring distance display units.
- 0c3f356: Add `duplicateShape()` utility for cloning shapes with a new ID. Supports optional coordinate offset and custom naming. The resolved name is also set as the clone's map label. Includes new `GeoPosition` type for 2D or 3D coordinate tuples and a `DuplicateShape` Storybook story.
- 1b39e64: Add CoffinCornerExtension for icon selection/hover bracket indicators

  New deck.gl LayerExtension that renders bracket corner indicators around
  selected and hovered icons via GPU shaders. Includes useCoffinCorner hook
  for managing selection state, event bus integration, and configurable
  highlight colors. SymbolLayer fiber type now includes CoffinCornerExtension
  props by default.

### Patch Changes

- 75fa668: - When using icons for Point shapes, `EditShapeLayer` now displays icon markers during editing instead of plain circles.
  - `DrawShapeLayer` and `EditShapeLayer` now self-register their fiber dependencies and no longer require manual fiber imports.
  - `useEditShape()` now exposes `updateFeature` to allow form-based updates before saving edits
- 17c4b6c: Extend CoffinCornerExtension to support ScatterplotLayer (circle points without icons) alongside IconLayer, and refine DisplayShapeLayer integration.
  - CoffinCornerExtension now supports ScatterplotLayer with quad expansion and circle-replicating fragment shaders
  - DisplayShapeLayer skips the highlight outline layer for all Point geometries (coffin corner brackets handle hover/select feedback)
  - DisplayShapeLayer forwards `highlightColor` as the bracket fill color via a cached tuple to avoid per-render allocations
  - Stable `DISPLAY_EXTENSIONS` module-level constant prevents unnecessary `getShaders()` re-evaluation
  - Removed icon-atlas-based coffin corner SVG sprites (replaced by shader SDF rendering)

- Updated dependencies [9a25205]
- Updated dependencies [fa05228]
  - @accelint/logger@1.1.0
  - @accelint/constants@0.3.0

## 2.0.0

### Major Changes

- 7b30771: Add `enableElevation` prop to DisplayShapeLayer for 3D shapes rendering.

  Remove dotted border treatment on shape selection — interactions no longer modify a shape's innate styling.

  Apply material-based brightness effect for hover and selection on all polygon shapes. All shapes brighten their outline color on hover or select (1.4×), with an even brighter combined state when both active (1.7×).

  Add new Selection layer for brightness effect while shape is selected.

  Add optional `maxElevation` property to `StyledFeatureProperties` as the source of truth for Polygon shape elevation. Point and LineString elevation is derived from z coordinates.

  Note: the only breaking change is removal of a redundant type. If you were using `type ShapeFeatureTypeValues` from map-toolkit, replace that with `type ShapeFeatureType`.

### Minor Changes

- d5ac9eb: Update EditShapeLayer to include the ability to pan the map while editing a shape when the spacebar is held.
- 311d7b6: Upgraded @deck.gl packages to 9.2 and removed shape layer double-click workaround

### Patch Changes

- 5567348: Update logger implementation to prevent singleton pollution.
- 1106ced: Fix bug where Enter on Save hotkey never unregistered, causing an error on EditShapeLayer remounts.
- Updated dependencies [3153e74]
- Updated dependencies [5567348]
- Updated dependencies [162895c]
  - @accelint/bus@4.0.0
  - @accelint/logger@1.0.1
  - @accelint/core@0.6.0
  - @accelint/hotkey-manager@2.0.0

## 1.5.0

### Minor Changes

- cae932c: Update circle tooltip to show radius instead of diameter in draw and edit modes.

### Patch Changes

- 9419d41: Fix infinite render loop in BaseMap when navigating in React Strict Mode. The camera store's `createMapStore` now properly handles initial state timing by directly updating existing instances when `setInitialState` is called after the instance already exists, which can occur during React Strict Mode's double-mount behavior.
- Updated dependencies [ed09ea6]
  - @accelint/logger@1.0.0

## 1.4.0

### Minor Changes

- 89914b0: Add Enter key hotkey to save shape edits. Pressing Enter while editing a shape now saves the changes and emits the existing `shapes:updated` event, providing an alternative to clicking the Save button.
- 7503e7e: Add click-to-place editing for Point shapes in EditShapeLayer.

  Point shapes now use a new `point-translate` edit mode that supports two ways to reposition:
  - **Click anywhere on the map** to instantly move the point to that location
  - **Drag the point directly** for traditional drag behavior

  This improves UX for points which previously required precise clicking on a very small target area.

### Patch Changes

- 6cb6e17: Enable antialiasing for maplibre to smooth out lines
- Updated dependencies [58bc0db]
  - @accelint/geo@0.6.0

## 1.3.0

### Minor Changes

- 58199e5: Updates use-cursor-coordinates to format MGRS and UTM default coordinates to follow a more expected format.

### Patch Changes

- 03c1e39: Add a tweak for the Viewport Resize debounce timing, 500 -> 200, for better visual feedback on updates.
- 0265877: Fixed error handling in `useCursorCoordinates` hook for coordinates outside UTM/MGRS valid range. UTM and MGRS coordinate systems are only valid between 80°S and 84°N. The hook now returns the default placeholder (`--, --`) when attempting to format polar coordinates in these formats.

## 1.2.0

### Minor Changes

- 878bfa6: Refactored the hotkey-manager package to decouple react.

## 1.1.0

### Minor Changes

- 0175dd1: Update useCursorCoordinates to accept a custom formatter and return more information about the raw coordinate.

### Patch Changes

- Updated dependencies [45275c4]
- Updated dependencies [d328b71]
  - @accelint/geo@0.5.1
  - @accelint/logger@0.1.5

## 1.0.0

### Major Changes

- 4e614fb: Refactor map-toolkit for v1 release:

  **Breaking Changes:**
  - Rename `useViewportState` → `useMapViewport`
  - Rename `useCameraState` → `useMapCamera`
  - Rename `useShapeSelection` → `useSelectShape`
  - Rename `INITIAL_VIEW_STATE` → `DEFAULT_VIEW_STATE` (in maplibre exports)
  - Remove `@accelint/map-toolkit/maplibre/constants` export

  **Bug Fixes:**
  - Fix `useMapCursorEffect` not updating cursor when props change
  - Fix saved viewports not restoring map position (now uses `CameraEventTypes.setCenter`)

  **Internal Improvements:**
  - Refactor all stores to use `createMapStore` factory pattern
  - Hoist `DEFAULT_VIEW_STATE` to `shared/constants`
  - Replace `console.warn` with `@accelint/logger` for conditional logging
  - Standardize drawStore to use shared mode-utils
  - Update saved viewports docs and story to use camera events correctly

### Minor Changes

- fd26776: Add EditShapeLayer for interactive shape editing

  **New features:**
  - `EditShapeLayer` component for editing existing shapes on the map
  - `showLabels` prop in `DisplayShapeLayer` now supports `'always' | 'hover' | 'never'` modes for flexible label display (hover mode shows labels only on shape hover)
  - `useEditShape` hook for managing edit state with `edit()`, `save()`, and `cancel()` controls
  - Support for all shape types: Point, LineString, Polygon, Rectangle, Circle, and Ellipse
  - Live measurement tooltips during editing (dimensions and area)
  - Shift key modifiers: hold for uniform scaling or 45° rotation snapping
  - ESC key to cancel editing
  - Locked shape support (`shape.locked` prevents editing)

  **Bug fixes:**
  - Add `boxZoom` to disabled controls list when Shift key is used for shape operations (prevents map zoom interference)

  **Internal improvements:**
  - Consolidate tooltip calculation logic into shared geometry measurement utilities
  - Standardize `mapId` optionality across hooks (optional with context fallback)
  - Add documentation for modes architecture (README.md in modes directory)
  - Rename `strokeColor` to `lineColor` and `strokeWidth` to `lineWidth` in style properties to align with deck.gl conventions
  - Rename `shapeType` to `shape` in Shape type for consistency with deck.gl

- fb3fe97: Add DrawShapeLayer for interactive shape drawing

  **New features:**
  - `DrawShapeLayer` component for drawing shapes on the map
  - `useDrawShape` hook for managing drawing state with `draw()` and `cancel()` controls
  - Support for multiple geometry types: Point, LineString, Polygon, Rectangle, Circle, and Ellipse
  - Real-time tooltips showing distance/area measurements during drawing
  - Protected drawing mode (cannot be interrupted by other map mode requests)
  - Double-click to finish polygons and lines
  - Shift-to-square constraint when drawing rectangles
  - Custom styling support (fill/line colors) when initiating drawing
  - ESC key to cancel drawing

  **Internal improvements:**
  - Refactor viewport to use shared unit abbreviation map from `shared/units.ts`

### Patch Changes

- 2e6389a: Fixes a regression in viewport size where viewport changes weren't updating

## 0.6.0

### Minor Changes

- 7c62ee3: Add display shapes layer to map-toolkit
- cebdbe7: Expose styleUrl in BaseMap props, update BASE_MAP_STYLE constant to DARK_BASE_MAP_STYLE and provide LIGHT_BASE_MAP_STYLE constant

### Patch Changes

- a7d3a1e: Fix bad build by updating configs
- aa296da: Update the shape labels and point icon behavior to match designs
- Updated dependencies [308023f]
  - @accelint/geo@0.5.0

## 0.5.0

### Minor Changes

- dde1386: Introduced a new camera feature in map-toolkit:
  Added camera state management, types, events, documentation, and Storybook stories.
  Added tests for camera state logic.
  Created a new postcss config for map-toolkit.
  Updated deckgl base map to integrate camera controls.
- 62da9ee: Add saved viewports library
- b0a37a0: Add events to disable/enable panning and zoom via event bus.

### Patch Changes

- 208b48d: With the changes to the basemap we now are explicitly rendering a `<MapLibre>` component and attatching a ref manually as opposed to calling the previous hook. The underlying api changes so we have to account for that in the MapControls component

## 0.4.1

### Patch Changes

- bb73a1e: Ensure dependencies all follow the same semver range across devtk, maptk, and designtk.
- Updated dependencies [bb73a1e]
  - @accelint/core@0.5.2
  - @accelint/bus@3.0.2
  - @accelint/geo@0.4.2

## 0.4.0

### Minor Changes

- 8802d14: Add map-cursor controller to map-toolkit.

### Patch Changes

- 34c42a0: Swap bundling to tsdown and auto generate exports entries in package.json.
- Updated dependencies [34c42a0]
  - @accelint/core@0.5.1
  - @accelint/bus@3.0.1
  - @accelint/geo@0.4.1

## 0.3.1

### Patch Changes

- Updated dependencies
  - @accelint/geo@0.4.0

## 0.3.0

### Minor Changes

- 7131cc0: Add `useCursorCoordinates`, a hook to retrieve the current coordinates for the mouse hovered position
- 874edd5: ## Breaking Change: Structured Clone Constraint

  The event bus payload is now constrained to values that are serializable by the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). This constraint aligns the TypeScript types with the actual runtime behavior of the `BroadcastChannel` API.

  ### What this means

  You can no longer pass the following types in event payloads:
  - Functions
  - Symbols
  - DOM nodes
  - Prototype chains (class instances lose their methods)
  - Properties with `undefined` values (they're omitted)

  ### How to migrate

  **❌ Before:**

  ```typescript
  bus.emit("user-action", {
    callback: () => console.log("done"), // ❌ Function
    userData: userClass, // ❌ Class instance with methods
    element: document.getElementById("foo"), // ❌ DOM node
  });
  ```

  **✅ After:**

  ```typescript
  // Option 1: Send only data, handle logic separately
  bus.emit("user-action", {
    actionType: "complete", // ✅ Primitive
    userData: { id: userClass.id, name: userClass.name }, // ✅ Plain object
    elementId: "foo", // ✅ Reference by ID
  });

  // Option 2: Use event types to trigger behavior
  bus.on("user-action-complete", () => {
    console.log("done"); // Handle callback logic in listener
  });
  ```

  ### Supported types
  - Primitives (string, number, boolean, null, BigInt)
  - Plain objects and arrays
  - Date, RegExp, Map, Set
  - Typed arrays (Uint8Array, etc.)
  - ArrayBuffer, Blob, File

  ### Finding issues

  TypeScript will now catch most violations at compile time. Runtime errors from `BroadcastChannel.postMessage()` indicate non-serializable values that slipped through.

- e8535c4: Adds ViewportSize component that shows the width and height of the viewport and updates with changes.
  Adds useViewportState for more fine-grained control of viewport data (lat/lon/zoom/bounds). Exports `useEffectEvent` ponyfill from `@accelint/bus/react`.

### Patch Changes

- 9ab8d72: Convert TextLayer README to Storybook doc and add JSDocs
- 99f6cd5: Add map-mode/store getCurrentModeOwner method to access the current map mode owner.
- 80db585: BREAKING CHANGES:
  Design Toolkit no longer exports `tv`, this is now available from Design Foundation

  Created new package @accelint/design-foundation that houses all of the Tailwind tokens, variants, base styles and utilities for easier reuse without having a dependency on the larger Design Toolkit

  Updated Map Toolkit Storybook and NextJS demo app styles to import the new Design Foundation

- f157e42: update picking info to remove more unserializable properties in map-toolkit
- 7539bbb: update vite config in map-toolkit to re-enable base-map render in storybook preview
- 86a95cf: refactor map mode to use module useSyncExternalStore pattern instead of class.

## 0.2.0

### Minor Changes

- b4d1b9b: Add map mode system with authorization flow for managing interaction modes.

  **New Features:**
  - `MapProvider` component for managing map mode state with instance isolation
  - `useMapMode()` hook for accessing and requesting mode changes
  - Authorization flow for resolving ownership conflicts when switching modes
  - Event bus integration for decoupled mode change communication
  - Support for multiple independent map instances with isolated state

  **API:**
  - `MapProvider` component (internal to `BaseMap`)
  - `useMapMode(id)` hook for UI components
  - `BaseMap` now requires `id` prop for instance identification
  - Observable store pattern using React's `useSyncExternalStore`

- 998dee6: add deckgl-layer-text for default text styling

### Patch Changes

- 303b61f: Pins the dependency version of Deck.gl to 9.1.14. We are not yet able to support 9.2.
- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- a8b8de2: Update README content in map-toolkit
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.

## 0.1.0

### Minor Changes

- 24e2def: Open-source the deckgl-layer-symbol package. Adds support for rendering MIL-STD-2525 symbologies as a Deck.gl layer.
- 5f45f43: Adds base-map component and DeckGL onClick and onHover event emitters. The example story shows how to use the @accelint/bus/react useOn hook to subscribe to the emitted events.
- 405d875: Introduced basic implementation for storybook for map-toolkit, including a decorator for deckGL for new stories.

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling

## 0.0.2

### Patch Changes

- 56d5af8: Initialization of Map Toolkit (MapTK) library
