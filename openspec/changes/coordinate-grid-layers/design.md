## Context

### Current State
The `@accelint/map-toolkit` package provides reusable deck.gl layers (text-layer, symbol-layer, shapes) but does not yet include grid visualization capabilities. We will build greenfield GARS and MGRS grid layers to support diverse applications across the standard-toolkit ecosystem.

### Target State
Build standalone, reusable grid layer infrastructure in `@accelint/map-toolkit` that eliminates boilerplate duplication, enables easy addition of new grid systems (UTM, H3, S2, USNG, etc.), and maintains a simple consumer API. The layers will be independently importable with full TypeScript support, React Fiber integration, and automatic event bus integration.

### Constraints
- Must support multiple grid systems (GARS, MGRS today; UTM, H3, S2 in future)
- Must reduce duplication across grid implementations
- Must work for diverse consumers with different use cases
- Must follow map-toolkit package structure and export conventions
- Must use optional dependencies for NGA grid libraries to keep package lightweight
- Must maintain high performance characteristics with large viewports
- Must work with both direct deck.gl API and React Fiber renderer
- Must prefer functional/declarative design while keeping consumer API simple

### Stakeholders
- Projects in standard-toolkit ecosystem (will adopt grid visualization)
- Map-toolkit maintainers (new code to maintain)
- Application developers (need simple, performant grid layers)
- Contributors adding new grid systems (need easy extensibility)

## Goals / Non-Goals

**Goals:**
- Build GARSLayer and MGRSLayer as standalone, reusable deck.gl layers from scratch
- Eliminate boilerplate duplication across grid implementations via shared base layer
- Enable easy addition of future grid systems (UTM, H3, S2, USNG) with minimal code
- Provide automatic event bus integration for all grid interactions
- Enable configurable zoom ranges and flexible styling API
- Create comprehensive documentation (MDX + Storybook)
- Maintain simple consumer API (looks like standard deck.gl layers)
- Use functional/declarative patterns internally (definitions as data, renderers as functions)
- Follow all map-toolkit conventions for exports, TypeScript, and React Fiber

**Non-Goals:**
- Building application-specific state management (consumers handle their own state)
- Building UI controls/menus for grid interaction (consumers build their own UI)
- Selection overlay layer (deferred for future work)
- Advanced grid features beyond basic rendering and interaction in v1
- Exposing plugin/renderer interfaces publicly in v1 (internal for now, future enhancement)
- Supporting grid systems beyond GARS and MGRS in v1

## Decisions

### Decision 1: Architecture - Declarative Grid Registry with Functional Core
**Decision**: Use a declarative registry architecture where all boilerplate lives in a single `BaseGridLayer`, grid-specific logic is expressed as pure data (definitions), and geometry generation is purely functional (renderers). Consumer-facing layers are thin wrappers (3-5 lines) that inject the appropriate definition.

**Rationale**:
- **Eliminates ~90% duplication**: Boilerplate written once, not per-grid
- **Enables extensibility**: Adding UTM/H3/S2 requires ~50 lines (definition + renderer + wrapper), not 200+ lines
- **Functional/declarative**: Definitions are data, renderers are pure functions, no class inheritance chains
- **Simple consumer API**: Users see normal deck.gl layers (`new GARSLayer()`), complexity is hidden
- **Maintainable**: Fix bugs once in BaseGridLayer, not in N places
- **Testable**: Test definitions, renderers, and base layer independently

**Alternatives Considered**:
- **Feature-per-directory** (original design) → Rejected: ~90% code duplication across grids, hard to add new systems
- **Plugin-based** with runtime registration → Rejected: more complex, harder to tree-shake, doesn't match deck.gl patterns
- **Factory pattern** → Rejected: less discoverable, TypeScript inference harder, not idiomatic deck.gl
- **Monolithic** with discriminated union → Rejected: messy union types, can't tree-shake unused grids

**Structure**:
```
src/deckgl/grid-layers/
├── core/
│   ├── base-grid-layer.ts         # All boilerplate + event bus (once!)
│   ├── validate-definition.ts     # Runtime validation of definitions
│   └── types.ts                   # Core interfaces (GridDefinition, etc.)
│
├── definitions/                   # Declarative configs (pure data)
│   ├── gars.ts                    # GARS definition
│   ├── mgrs.ts                    # MGRS definition
│   └── index.ts
│
├── renderers/                     # Functional geometry generation
│   ├── gars-renderer.ts           # Pure function: context → geometry
│   ├── mgrs-renderer.ts           # Pure function: context → geometry
│   └── types.ts                   # Renderer interface (internal v1)
│
├── shared/
│   ├── viewport-utils.ts          # Viewport bounds calculation
│   └── constants.ts               # Shared constants
│
├── gars-layer/
│   ├── index.ts                   # Thin wrapper (~15 lines)
│   ├── types.ts                   # GARSLayerProps
│   ├── fiber.ts                   # React Fiber registration
│   ├── index.test.ts
│   ├── gars-layer.docs.mdx
│   └── gars-layer.stories.tsx
│
├── mgrs-layer/
│   └── (same structure)
│
└── index.ts                       # Public exports
```

**Key Concepts**:

1. **GridDefinition** (pure data):
```typescript
interface GridDefinition {
  id: string;
  name: string;
  zoomRanges: GridZoomRange[];
  defaultStyles: Record<string, GridStyleConfig>;
  renderer: GridRenderer;
  options?: { wrapLongitude?: boolean; requiresZones?: boolean };
}
```

2. **GridRenderer** (pure function):
```typescript
interface GridRenderer {
  render(context: RenderContext): RenderResult;
}

// Pure function: inputs → outputs (no side effects)
function createGARSRenderer(): GridRenderer {
  const grids = Grids.create();
  return {
    render: (context) => {
      // Generate geometry from context
      return { lines: [...], labels: [...] };
    },
  };
}
```

3. **Thin wrapper** (consumer API):
```typescript
export class GARSLayer extends BaseGridLayer {
  static override layerName = 'GARSLayer';

  constructor(props: GARSLayerProps) {
    super({
      ...props,
      definition: garsDefinition,
      styleOverrides: {
        THIRTY_MINUTE: props.thirtyMinuteStyle,
        FIFTEEN_MINUTE: props.fifteenMinuteStyle,
        FIVE_MINUTE: props.fiveMinuteStyle,
      },
    });
  }
}
```

**Benefits**:
- Add new grid system: write definition (~20 lines), renderer (~30 lines), wrapper (~15 lines) = ~65 lines total
- Current approach: copy-paste 200+ lines and modify
- Future: 3x less code per grid, zero duplication

### Decision 2: Dependencies - Optional Dependencies Strategy
**Decision**: Add `@ngageoint/gars-js` and `@ngageoint/mgrs-js` as optional dependencies rather than peer dependencies or regular dependencies.

**Rationale**:
- Users only install what they need (GARS or MGRS, not both)
- Keeps map-toolkit package size minimal
- Follows map-toolkit pattern for specialized dependencies
- npm/pnpm will install optional deps by default but won't fail if unavailable

**Alternatives Considered**:
- Peer dependencies → Rejected: forces all users to manage versions even if they don't use grids
- Regular dependencies → Rejected: bloats package for users who don't need grids
- No dependencies, require users to pass library instance → Rejected: worse DX, not idiomatic

### Decision 3: Event Bus Integration - Automatic in BaseGridLayer
**Decision**: Implement event bus integration once in `BaseGridLayer` so all grid layers automatically get hover, click, and selection events without per-layer implementation.

**Rationale**:
- **Zero duplication**: Event logic written once, inherited by all grids
- Consistency with existing map-toolkit event patterns (DisplayShapeLayer)
- Enables multi-map scenarios with instance ID in events
- Type-safe event handling for consumers
- Allows users to opt out if they handle events externally

**Event Types**:
```typescript
type GridEvent =
  | { type: 'grid.hover.enter'; cellId: string; gridType: string; mapId: string }
  | { type: 'grid.hover.exit'; cellId: string; gridType: string; mapId: string }
  | { type: 'grid.click'; cellId: string; gridType: string; coords: [number, number]; mapId: string }
  | { type: 'grid.selected'; cellId: string; gridType: string; mapId: string }
  | { type: 'grid.deselected'; cellId: string; gridType: string; mapId: string };
```

**Implementation in BaseGridLayer**:
```typescript
export class BaseGridLayer extends CompositeLayer {
  private eventBus = Broadcast.getInstance<GridEvent>();
  private lastHoveredCell: string | null = null;

  override renderLayers() {
    const pickable = this.props.enableEvents !== false;

    // PathLayer with event handlers
    layers.push(new PathLayer({
      // ... other props
      pickable,
      onClick: pickable ? this.handleClick : undefined,
      onHover: pickable ? this.handleHover : undefined,
    }));
  }

  private handleClick = (info: PickingInfo) => {
    if (!info.object) return;
    this.eventBus.emit({
      type: 'grid.click',
      cellId: info.object.cellId,
      gridType: this.definition.id,  // from definition!
      coords: [info.coordinate[0], info.coordinate[1]],
      mapId: this.props.mapId || 'default',
    });
  };

  private handleHover = (info: PickingInfo) => {
    const cellId = info.object?.cellId || null;

    // Deduplicate hover events
    if (cellId === this.lastHoveredCell) return;

    if (this.lastHoveredCell) {
      this.eventBus.emit({ type: 'grid.hover.exit', /* ... */ });
    }
    if (cellId) {
      this.eventBus.emit({ type: 'grid.hover.enter', /* ... */ });
    }

    this.lastHoveredCell = cellId;
  };
}
```

**Benefits**:
- GARS, MGRS, UTM, H3, S2 all get events automatically
- Event logic tested once, works everywhere
- Add `enableEvents` prop support for free
- Export event types for consumer type safety

**Alternatives Considered**:
- Per-layer implementation → Rejected: duplicates event logic N times
- Custom event system → Rejected: reinvents wheel, not consistent with map-toolkit
- Callback props only → Rejected: doesn't support multi-map scenarios or global listeners
- No events → Rejected: reduces interactivity and integration options

### Decision 4: Zoom Configuration - Configurable with Sensible Defaults
**Decision**: Make zoom ranges fully configurable via `zoomRanges` prop while providing sensible defaults based on standard grid visualization practices.

**Rationale**:
- Flexibility for different use cases (high-detail apps vs overview maps)
- Current hardcoded values are good defaults but shouldn't be limitations
- Type-safe configuration with TypeScript
- Allows overlapping ranges for context (coarse grids visible while zoomed in)

**Configuration Interface**:
```typescript
interface GridZoomRange {
  type: GridType;           // Which grid precision level
  key: string;              // Unique identifier for layer IDs
  minZoom: number;          // Minimum zoom for visibility
  maxZoom: number;          // Maximum zoom for visibility
  labelMinZoom?: number;    // Optional separate threshold for labels
}
```

**Export Strategy**:
- Export default constants (GARS_ZOOM_RANGES, MGRS_ZOOM_RANGES)
- Users can spread defaults and override specific values
- Validate ranges at runtime (minZoom <= maxZoom)

**Alternatives Considered**:
- Hardcoded only → Rejected: too inflexible for different use cases
- Per-grid-type min/max props → Rejected: verbose API, harder to configure overlapping ranges
- Zoom presets ("low", "medium", "high") → Rejected: less flexible than direct configuration

### Decision 5: Styling API - Partial Merge with Defaults
**Decision**: Support per-grid-type style props that partially merge with opinionated defaults.

**Rationale**:
- Users can customize specific properties without recreating entire style configs
- Follows map-toolkit pattern (see TextLayer default-settings.ts)
- Opinionated defaults provide good out-of-box experience
- Spreads/merging in constructor keeps layer logic simple

**Style Props Pattern** (GARS example):
```typescript
interface GARSLayerProps extends CompositeLayerProps {
  thirtyMinuteStyle?: Partial<GridStyleConfig>;
  fifteenMinuteStyle?: Partial<GridStyleConfig>;
  fiveMinuteStyle?: Partial<GridStyleConfig>;
  showLabels?: boolean;
  zoomRanges?: GridZoomRange[];
  enableEvents?: boolean;
}
```

**Style Merging**:
```typescript
const style = {
  ...DEFAULT_STYLES[styleKey],
  ...this.props.thirtyMinuteStyle,
};
```

**Alternatives Considered**:
- Single global style prop → Rejected: can't differentiate coarse vs fine grid styling
- No defaults, require full config → Rejected: poor DX, most users want sensible defaults
- Deep merge with lodash → Rejected: unnecessary dependency for simple object spread

### Decision 6: React Fiber Support - Side-Effect Registration
**Decision**: Provide separate `fiber.ts` files for React Fiber registration following map-toolkit pattern, imported as side effects.

**Rationale**:
- Matches map-toolkit conventions (text-layer/fiber, symbol-layer/fiber)
- Side-effect import keeps registration automatic and idiomatic
- Declared in package.json sideEffects for bundler optimization
- Enables JSX syntax without manual registration

**Usage Pattern**:
```tsx
import '@accelint/map-toolkit/deckgl/grid-layers/mgrs-layer/fiber';

<mgrsLayer id="mgrs" showLabels={true} />
```

**Alternatives Considered**:
- Automatic registration in main export → Rejected: breaks tree-shaking, forces React dependency
- Manual registration required → Rejected: worse DX, easy to forget
- No React Fiber support → Rejected: limits adoption in React projects

### Decision 7: Definition Validation - Runtime Checks with Helpful Errors
**Decision**: Validate grid definitions at runtime in `BaseGridLayer` constructor with clear, actionable error messages to catch misconfigurations during development.

**Rationale**:
- Catch config errors immediately (fail fast)
- Helpful error messages guide developers
- TypeScript helps but can't catch logical errors (minZoom > maxZoom)
- Prevents runtime crashes in production from bad definitions
- Low overhead (runs once per layer construction)

**Validation Checks**:
```typescript
export function validateDefinition(def: GridDefinition): void {
  // Required fields
  if (!def.id) throw new Error('Grid definition must have an id');
  if (!def.zoomRanges?.length) throw new Error('Must have at least one zoom range');

  // Zoom range validity
  for (const range of def.zoomRanges) {
    if (range.minZoom > range.maxZoom) {
      throw new Error(
        `Invalid zoom range for ${range.key}: minZoom (${range.minZoom}) > maxZoom (${range.maxZoom})`
      );
    }
    if (range.labelMinZoom && range.labelMinZoom < range.minZoom) {
      throw new Error(
        `Invalid label zoom for ${range.key}: labelMinZoom below minZoom`
      );
    }
  }

  // Style completeness
  for (const range of def.zoomRanges) {
    if (!def.defaultStyles[range.type]) {
      throw new Error(`Missing default style for grid type: ${range.type}`);
    }
  }
}
```

**Usage**:
```typescript
// In BaseGridLayer constructor
constructor(props) {
  super(props);
  validateDefinition(props.definition); // Fail fast!
  this.definition = props.definition;
}
```

**Benefits**:
- Developers get clear error messages immediately
- Prevents silent failures or weird rendering bugs
- Validates definition completeness (styles, zoom ranges, etc.)
- No performance impact (runs once during construction)

**Alternatives Considered**:
- TypeScript only → Rejected: can't catch logical errors like minZoom > maxZoom
- No validation → Rejected: silent failures are hard to debug
- Schema validation library (Zod, Yup) → Rejected: adds dependency, overkill for simple checks

### Decision 8: Implementation Strategy - Greenfield Build-and-Publish
**Decision**: Build the grid layer infrastructure from scratch in map-toolkit as standalone, reusable components.

**Rationale**:
- **Clean architecture**: Design the declarative pattern correctly from day one without legacy constraints
- **Straightforward workflow**: Build → Test → Publish → Projects adopt (linear flow)
- **No migration complexity**: Consumers simply install and use the package
- **Iterate freely**: Can refine architecture based on real usage without breaking existing code
- **Faster**: Direct implementation, not extract/refactor cycle

**Phases**:
1. **Phase 1: Build Core** - Implement BaseGridLayer, validation, event integration
2. **Phase 2: GARS Implementation** - Definition, renderer, wrapper, tests, docs
3. **Phase 3: MGRS Implementation** - Definition, renderer, wrapper, tests, docs
4. **Phase 4: Validation** - Storybook stories, performance testing, API validation
5. **Phase 5: Publish** - Publish to registry, available for all projects

**Benefits**:
- Clean git history in map-toolkit
- Can iterate on architecture without constraints
- Simple adoption path for any project (install and import)
- No risk of breaking existing implementations
- Extensible foundation for future grid systems

**Alternatives Considered**:
- Extract from existing codebase → Rejected: brings legacy patterns, complex migration
- Copy and refactor → Rejected: still inherits assumptions from original context
- Branch-based development → Rejected: greenfield in main branch is cleaner

## Risks / Trade-offs

### Risk: Optional Dependencies Not Installed
**Risk**: Users might not have `@ngageoint/gars-js` or `@ngageoint/mgrs-js` installed when using grid layers.

**Mitigation**:
- Clear documentation indicating optional dependencies
- Runtime checks with helpful error messages if library missing
- Package manager (pnpm/npm) typically installs optional deps by default
- Export constants for checking availability: `GARS_AVAILABLE`, `MGRS_AVAILABLE`

### Risk: Breaking Changes to @ngageoint Libraries
**Risk**: Future versions of gars-js or mgrs-js could introduce breaking changes affecting layer implementation.

**Mitigation**:
- Pin specific version ranges in optional dependencies
- Unit tests cover library integration points
- Document supported library versions in README
- Consider vendoring critical geometry generation functions if libraries become unstable

### Risk: Performance Degradation with Large Viewports
**Risk**: Generating geometry for many grid cells in large viewports could cause frame rate drops.

**Mitigation**:
- Current implementation already limits to viewport bounds (maintain this)
- Profile performance with large viewports during testing
- Consider adding cell limit prop if issues arise
- Document performance characteristics and recommend zoom ranges

### Risk: Event Bus Overhead
**Risk**: Emitting events on every hover/interaction could impact performance or create memory leaks if listeners not cleaned up.

**Mitigation**:
- Debounce hover events (only emit on cell change, not continuous movement)
- Document proper event listener cleanup patterns
- Provide `enableEvents` prop to opt out
- Monitor event frequency in development

### Risk: BaseGridLayer Abstraction Too Generic
**Risk**: Trying to handle all grid systems in one base class could lead to a leaky abstraction or special-case logic creeping in.

**Mitigation**:
- Start with GARS and MGRS (proven implementations to validate pattern)
- Keep renderer interface flexible (context → geometry)
- Definition options field for grid-specific flags (wrapLongitude, requiresZones)
- Review BaseGridLayer after MGRS to ensure it stays clean
- If special cases appear, consider renderer strategies pattern

### Risk: Definition Validation Overhead
**Risk**: Runtime validation on every layer construction could impact performance in apps with many layers.

**Mitigation**:
- Validation runs once per layer construction (not per render)
- Can be disabled in production builds if needed (DEV-only flag)
- Validation is fast (simple checks, no complex logic)
- Benefits outweigh cost (catch bugs early)

### Trade-off: More Granular Exports = More Package.json Maintenance
**Trade-off**: Following map-toolkit's granular export pattern creates many export entries in package.json.

**Accepted**: This matches map-toolkit conventions and enables tree-shaking. The verbosity is a one-time cost with long-term benefits for consumers.

### Trade-off: Opinionated Defaults vs Flexibility
**Trade-off**: Providing opinionated defaults might not match all design systems, but full flexibility requires more configuration.

**Accepted**: Defaults provide good DX for 80% of use cases while partial merge allows full customization when needed. This is the right balance.

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
1. Create `src/deckgl/grid-layers/` directory structure in map-toolkit
2. Implement `core/types.ts` with interfaces (GridDefinition, GridRenderer, etc.)
3. Implement `core/validate-definition.ts` with validation logic and tests
4. Implement `core/base-grid-layer.ts`:
   - CompositeLayer boilerplate (viewport, zoom, bounds)
   - Generic zoom range loop
   - PathLayer and TextLayer construction
   - Event bus integration (hover, click)
   - Style merging logic
5. Implement `shared/viewport-utils.ts` (viewport bounds calculation)
6. Write unit tests for BaseGridLayer

### Phase 2: GARS Implementation (Week 1-2)
1. Create `definitions/gars.ts` with declarative config (zoom ranges, styles)
2. Implement `renderers/gars-renderer.ts` (functional geometry generation)
3. Create `gars-layer/index.ts` thin wrapper class
4. Create `gars-layer/types.ts` with GARSLayerProps
5. Create `gars-layer/fiber.ts` for React Fiber registration
6. Write unit tests for GARS renderer
7. Create `gars-layer/gars-layer.stories.tsx` in Storybook
8. Create `gars-layer/gars-layer.docs.mdx` with usage examples
9. Validate in Storybook (rendering, events, styling)

### Phase 3: MGRS Implementation (Week 2)
1. Create `definitions/mgrs.ts` with declarative config
2. Implement `renderers/mgrs-renderer.ts` (functional geometry generation with zone handling)
3. Create `mgrs-layer/index.ts` thin wrapper class
4. Create `mgrs-layer/types.ts` with MGRSLayerProps
5. Create `mgrs-layer/fiber.ts` for React Fiber registration
6. Write unit tests for MGRS renderer
7. Create `mgrs-layer/mgrs-layer.stories.tsx` in Storybook
8. Create `mgrs-layer/mgrs-layer.docs.mdx` with usage examples
9. Validate in Storybook (rendering, events, styling, zone handling)

### Phase 4: Package Configuration and Testing (Week 2-3)
1. Update map-toolkit package.json:
   - Add `@ngageoint/gars-js` and `@ngageoint/mgrs-js` as optionalDependencies
   - Add granular exports for grid-layers
   - Add fiber.ts paths to sideEffects array
2. Run `pnpm build` and fix any compilation errors
3. Run `pnpm ci:lint` and fix lint issues
4. Run `pnpm type-check` and verify types
5. Performance profiling with large viewports
6. Test event bus integration end-to-end
7. Test React Fiber rendering in Storybook
8. Write integration tests

### Phase 5: Publish (Week 3)
1. Final validation in Storybook:
   - Visual rendering for all grid types and zoom levels
   - Interaction testing (hover, click, events)
   - Performance profiling with various viewport sizes
   - Verify React Fiber integration
2. Documentation review:
   - MDX docs complete and accurate
   - Type definitions exported correctly
   - README with usage examples
3. Publish alpha version of map-toolkit (e.g., 1.6.0-alpha.0)
4. Test alpha in a real project:
   - Install and import layers
   - Verify event bus integration
   - Test styling customization
   - Validate TypeScript types
5. Fix any issues discovered
6. Publish stable version of map-toolkit (e.g., 1.6.0)
7. Announce availability to standard-toolkit projects

### Rollback Strategy
Since this is greenfield without migration:
- New functionality only, no breaking changes to existing map-toolkit APIs
- If bugs discovered: Fix and republish patch version
- No complex rollback needed (projects just upgrade when ready)

## Callout Responses

**[Zoom Range Override]**: Acknowledged and handled. This library does not use `Grids.create()` defaults or `mgrs.json` zoom filtering. All zoom range decisions live in the `GridDefinition.zoomRanges` array (and the user-overridable `zoomRanges` prop), with explicit min/max comparisons in `BaseGridLayer.renderLayers()`. The MGRS definition uses overlapping ranges (GZD 0–20, 100km 4–20, 10km 8–20, 1km 11–20) so coarser levels remain visible at higher zoom — exactly what the library defaults override.

**[Antimeridian Detection]**: Acknowledged. `shared/viewport-utils.ts` will handle both distinct cases:
1. **Full-globe viewport** — detected by comparing `viewport.width` to `512 × 2^zoom`. When true, bounds hardcode to `(-180, -80, 180, 84)`.
2. **Antimeridian crossing** — detected when `nw.lon > se.lon`. Normalized by adding 360 to `se.lon`. Followed by a post-normalization clamp to catch any residual out-of-range values.

Both cases must be checked separately; missing either produces invisible or clipped grids. Unit tests will cover both edge cases explicitly.

**[Draw Order is Intentional]**: Acknowledged. `GridDefinition.zoomRanges` is ordered **fine → coarse** (finest precision first, coarsest last). `BaseGridLayer.renderLayers()` iterates this array in order and appends PathLayers + TextLayers to the output array in that order. Since Deck.gl renders layers in array order (later = on top), GZD always renders on top of finer grids. The `zoomRanges` prop documentation will warn that reordering this array changes draw order.

**[Label Minimum Zoom]**: Acknowledged. `GridZoomRange` has a separate optional `labelMinZoom` field distinct from `minZoom`. `BaseGridLayer.renderLayers()` evaluates `showLabels && zoom >= (entry.labelMinZoom ?? entry.minZoom)` independently from the line visibility check. A precision level may render lines before its labels appear. This is a spec requirement in `grid-zoom-configuration` and is tested explicitly.

**[selectionEnabled Flag]**: Not applicable — this library does not include a `SelectionOverlayLayer` in v1. Selection rendering is deferred (see Non-Goals in design context and proposal.md). Consumers who need selection overlay will render their own `PolygonLayer` driven by state they manage. When `SelectionOverlayLayer` is added in a future version, the `selectionEnabled` gating decision will need to be revisited at that time — either as a prop on the layer or enforced upstream by the consumer.

## Open Questions

1. **Should we include a selection overlay layer in v1?**
   - Selection overlay would show selected grid cells visually
   - Recommend: Defer until there's a project that needs it
   - Would follow similar pattern (definition + renderer) if needed later

2. **What is the testing strategy?**
   - Unit tests: Validate definitions, test renderers in isolation, test BaseGridLayer
   - Visual tests: Storybook stories for each grid type
   - Integration tests: React Fiber usage, event bus integration
   - Recommend: Combination of all three for comprehensive coverage

3. **Should we optimize for very large viewports?**
   - Viewport-bounded queries should handle typical usage well
   - Could add cell limits or additional culling in BaseGridLayer if needed
   - Recommend: Profile during validation, optimize only if performance issues arise

4. **When should we expose GridRenderer interface publicly?**
   - v1: Keep internal, validate pattern with GARS/MGRS first
   - v2: Expose if third-party grid systems emerge
   - Would enable custom grid implementations outside map-toolkit

5. **Should layers emit more granular events?**
   - E.g., viewport change, zoom level change, visible cells changed?
   - Recommend: Start with interaction events (hover/click), add more only if use cases emerge
   - Easy to add later without breaking changes

6. **How do we handle renderer instance lifecycle?**
   - Should renderers be created once and reused?
   - Or created per-layer instance?
   - Current design: Created once in definition, shared across layer instances
   - Need to verify this doesn't cause issues with stateful grid libraries

7. **Should definitions be registered in a central registry?**
   - Could enable `GridLayer.create('gars', props)` factory pattern
   - Or keep simple: import specific layer classes
   - Recommend: Keep simple for v1, registry is future enhancement
