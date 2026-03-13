# Implementation Tasks

## Phase 1: Core Infrastructure

### 1. Setup and Directory Structure

- [ ] 1.1 Confirm `@accelint/map-toolkit` package exists at expected path and identify the target directory for grid layers (`src/deckgl/grid-layers/`)
- [ ] 1.2 Create `src/deckgl/grid-layers/` directory
- [ ] 1.3 Create `core/` subdirectory for base layer and infrastructure
- [ ] 1.4 Create `definitions/` subdirectory for declarative configs
- [ ] 1.5 Create `renderers/` subdirectory for functional geometry generation
- [ ] 1.6 Create `shared/` subdirectory for common utilities
- [ ] 1.7 Create `gars-layer/` subdirectory for GARS wrapper
- [ ] 1.8 Create `mgrs-layer/` subdirectory for MGRS wrapper
- [ ] 1.9 Add `@ngageoint/gars-js` to map-toolkit optionalDependencies in package.json
- [ ] 1.10 Add `@ngageoint/mgrs-js` to map-toolkit optionalDependencies in package.json
- [ ] 1.11 Verify `@accelint/bus` is already in dependencies (should be from other features)

### 2. Core Types and Interfaces

- [ ] 2.1 Create `core/types.ts` with GridDefinition interface
- [ ] 2.2 Add GridZoomRange interface to core/types.ts
- [ ] 2.3 Add GridStyleConfig interface to core/types.ts
- [ ] 2.4 Add GridRenderer interface to core/types.ts
- [ ] 2.5 Add RenderContext interface (bounds, zoom, gridType)
- [ ] 2.6 Add RenderResult interface (lines, labels)
- [ ] 2.7 Add LineData and LabelData types
- [ ] 2.8 Add GridEvent discriminated union type
- [ ] 2.9 Add BaseGridLayerProps interface

### 3. Definition Validation

- [ ] 3.1 Create `core/validate-definition.ts` file
- [ ] 3.2 Implement validateDefinition function with required field checks
- [ ] 3.3 Add zoom range validation (minZoom <= maxZoom)
- [ ] 3.4 Add label zoom validation (labelMinZoom >= minZoom if present)
- [ ] 3.5 Add style completeness validation (all zoom range types have styles)
- [ ] 3.6 Add helpful error messages for each validation failure
- [ ] 3.7 Write unit tests for validate-definition.ts
- [ ] 3.8 Test validation with valid definitions (should pass)
- [ ] 3.9 Test validation with invalid definitions (should throw with clear errors)

### 4. Shared Utilities

- [ ] 4.1 Create `shared/viewport-utils.ts`
- [ ] 4.2 Implement calculateViewportBounds function
- [ ] 4.3 Add viewport boundary type definitions
- [ ] 4.4 Write unit tests for viewport-utils.ts
- [ ] 4.5 Create `shared/constants.ts` with shared constants
- [ ] 4.6 Add default color constants if needed

### 5. BaseGridLayer Implementation

- [ ] 5.1 Create `core/base-grid-layer.ts` extending CompositeLayer
- [ ] 5.2 Add definition validation in constructor
- [ ] 5.3 Implement initializeState() for common initialization
- [ ] 5.4 Implement shouldUpdateState() checking viewport and props changes
- [ ] 5.5 Implement renderLayers() with generic zoom range loop
- [ ] 5.6 Add viewport and bounds extraction logic in renderLayers()
- [ ] 5.7 Call renderer.render() for each active zoom range
- [ ] 5.8 Construct PathLayer for grid lines with generic config
- [ ] 5.9 Construct TextLayer for labels with generic config
- [ ] 5.10 Implement getStyle() method with style merging (defaults + overrides)
- [ ] 5.11 Add wrapLongitude support based on definition options

### 6. Event Bus Integration in BaseGridLayer

- [ ] 6.1 Create typed Broadcast instance in BaseGridLayer
- [ ] 6.2 Add lastHoveredCell private field for deduplication
- [ ] 6.3 Add pickable prop support (enableEvents default true)
- [ ] 6.4 Implement handleClick method
- [ ] 6.5 Emit grid.click event with cellId, gridType, coords, mapId
- [ ] 6.6 Implement handleHover method
- [ ] 6.7 Emit grid.hover.enter event on cell entry
- [ ] 6.8 Emit grid.hover.exit event on cell exit
- [ ] 6.9 Add hover event deduplication (only emit on cell change)
- [ ] 6.10 Wire up onClick and onHover handlers to PathLayer

### 7. BaseGridLayer Testing

- [ ] 7.1 Create `core/base-grid-layer.test.ts`
- [ ] 7.2 Write test for definition validation on construction
- [ ] 7.3 Write test for shouldUpdateState with viewport changes
- [ ] 7.4 Write test for shouldUpdateState with props changes
- [ ] 7.5 Write mock GridDefinition and GridRenderer for testing
- [ ] 7.6 Write test for renderLayers zoom range filtering
- [ ] 7.7 Write test for style merging (defaults + overrides)
- [ ] 7.8 Write test for event emission (hover, click)
- [ ] 7.9 Write test for event deduplication
- [ ] 7.10 Write test for enableEvents prop disabling events

## Phase 2: GARS Implementation

### 8. GARS Definition

- [ ] 8.1 Create `definitions/gars.ts` file
- [ ] 8.2 Define GARS zoom ranges array (30min, 15min, 5min) with standard values
- [ ] 8.3 Define GARS default styles for each grid type
- [ ] 8.4 Import createGARSRenderer (forward reference, implement next)
- [ ] 8.5 Export garsDefinition object implementing GridDefinition
- [ ] 8.6 Set definition id to 'gars'
- [ ] 8.7 Set definition options (wrapLongitude: false)

### 9. GARS Renderer

- [ ] 9.1 Create `renderers/gars-renderer.ts` file
- [ ] 9.2 Import Grids from @ngageoint/gars-js with optional import pattern
- [ ] 9.3 Add runtime check if Grids is unavailable with helpful error
- [ ] 9.4 Implement createGARSRenderer factory function
- [ ] 9.5 Create Grids instance in factory
- [ ] 9.6 Implement render method accepting RenderContext
- [ ] 9.7 Query grid cells based on bounds and gridType
- [ ] 9.8 Transform grid cells to LineData format
- [ ] 9.9 Transform grid cells to LabelData format
- [ ] 9.10 Return RenderResult with lines and labels
- [ ] 9.11 Handle edge cases (empty results, invalid bounds)

### 10. GARS Renderer Testing

- [ ] 10.1 Create `renderers/gars-renderer.test.ts`
- [ ] 10.2 Write test for createGARSRenderer factory
- [ ] 10.3 Write test for rendering 30-minute grids
- [ ] 10.4 Write test for rendering 15-minute grids
- [ ] 10.5 Write test for rendering 5-minute grids
- [ ] 10.6 Write test for viewport bounds filtering
- [ ] 10.7 Write test for empty results (out of bounds)
- [ ] 10.8 Write test for library unavailable error
- [ ] 10.9 Mock @ngageoint/gars-js for deterministic testing

### 11. GARS Layer Wrapper

- [ ] 11.1 Create `gars-layer/index.ts` file
- [ ] 11.2 Create GARSLayer class extending BaseGridLayer
- [ ] 11.3 Set static layerName to 'GARSLayer'
- [ ] 11.4 Implement constructor accepting GARSLayerProps
- [ ] 11.5 Inject garsDefinition in super() call
- [ ] 11.6 Map thirtyMinuteStyle prop to styleOverrides.THIRTY_MINUTE
- [ ] 11.7 Map fifteenMinuteStyle prop to styleOverrides.FIFTEEN_MINUTE
- [ ] 11.8 Map fiveMinuteStyle prop to styleOverrides.FIVE_MINUTE
- [ ] 11.9 Pass through showLabels, enableEvents, mapId props

### 12. GARS Layer Types

- [ ] 12.1 Create `gars-layer/types.ts` file
- [ ] 12.2 Define GARSLayerProps interface extending BaseGridLayerProps
- [ ] 12.3 Add thirtyMinuteStyle?: Partial<GridStyleConfig>
- [ ] 12.4 Add fifteenMinuteStyle?: Partial<GridStyleConfig>
- [ ] 12.5 Add fiveMinuteStyle?: Partial<GridStyleConfig>
- [ ] 12.6 Add zoomRanges?: GridZoomRange[] (optional override)
- [ ] 12.7 Export GARS-specific grid type enum if needed

### 13. GARS Layer Testing

- [ ] 13.1 Create `gars-layer/index.test.ts`
- [ ] 13.2 Write test for GARSLayer construction
- [ ] 13.3 Write test for definition injection
- [ ] 13.4 Write test for style prop mapping
- [ ] 13.5 Write test for custom zoom ranges
- [ ] 13.6 Mock BaseGridLayer to verify correct props passed
- [ ] 13.7 Verify layerName is set correctly

### 14. GARS React Fiber Support

- [ ] 14.1 Create `gars-layer/fiber.ts` file
- [ ] 14.2 Import registerLayerType from map-toolkit deckgl/react
- [ ] 14.3 Import GARSLayer from index
- [ ] 14.4 Call registerLayerType('garsLayer', GARSLayer)
- [ ] 14.5 Add fiber.ts path to package.json sideEffects array

### 15. GARS Documentation

- [ ] 15.1 Create `gars-layer/gars-layer.docs.mdx`
- [ ] 15.2 Add overview section explaining GARS grid system
- [ ] 15.3 Add installation instructions
- [ ] 15.4 Add basic usage example with code
- [ ] 15.5 Add styling customization examples
- [ ] 15.6 Add zoom range configuration examples
- [ ] 15.7 Add event handling examples
- [ ] 15.8 Add React Fiber usage examples
- [ ] 15.9 Document GARSLayerProps API

### 16. GARS Storybook Stories

- [ ] 16.1 Create `gars-layer/gars-layer.stories.tsx`
- [ ] 16.2 Add "Default" story with basic GARS layer
- [ ] 16.3 Add "Custom Styles" story with style overrides
- [ ] 16.4 Add "Custom Zoom Ranges" story
- [ ] 16.5 Add "Events" story demonstrating event bus
- [ ] 16.6 Add "React Fiber" story with JSX syntax
- [ ] 16.7 Add controls for interactive prop testing
- [ ] 16.8 Add map centering and zoom controls

## Phase 3: MGRS Implementation

### 17. MGRS Definition

- [ ] 17.1 Create `definitions/mgrs.ts` file
- [ ] 17.2 Define MGRS zoom ranges array (GZD, 100km, 10km, 1km) with standard values
- [ ] 17.3 Define MGRS default styles for each grid type
- [ ] 17.4 Import createMGRSRenderer (forward reference, implement next)
- [ ] 17.5 Export mgrsDefinition object implementing GridDefinition
- [ ] 17.6 Set definition id to 'mgrs'
- [ ] 17.7 Set definition options (wrapLongitude: true, requiresZones: true)

### 18. MGRS Renderer

- [ ] 18.1 Create `renderers/mgrs-renderer.ts` file
- [ ] 18.2 Import MGRS from @ngageoint/mgrs-js with optional import pattern
- [ ] 18.3 Add runtime check if MGRS is unavailable with helpful error
- [ ] 18.4 Implement createMGRSRenderer factory function
- [ ] 18.5 Create MGRS instance in factory
- [ ] 18.6 Implement render method accepting RenderContext
- [ ] 18.7 Query grid cells based on bounds and gridType
- [ ] 18.8 Handle zone boundaries and wrapping
- [ ] 18.9 Transform grid cells to LineData format
- [ ] 18.10 Transform grid cells to LabelData format
- [ ] 18.11 Return RenderResult with lines and labels
- [ ] 18.12 Handle edge cases (zone transitions, polar regions)

### 19. MGRS Renderer Testing

- [ ] 19.1 Create `renderers/mgrs-renderer.test.ts`
- [ ] 19.2 Write test for createMGRSRenderer factory
- [ ] 19.3 Write test for rendering GZD grids
- [ ] 19.4 Write test for rendering 100km grids
- [ ] 19.5 Write test for rendering 10km grids
- [ ] 19.6 Write test for rendering 1km grids
- [ ] 19.7 Write test for zone boundary handling
- [ ] 19.8 Write test for viewport bounds filtering
- [ ] 19.9 Write test for empty results (out of bounds)
- [ ] 19.10 Write test for library unavailable error
- [ ] 19.11 Mock @ngageoint/mgrs-js for deterministic testing

### 20. MGRS Layer Wrapper

- [ ] 20.1 Create `mgrs-layer/index.ts` file
- [ ] 20.2 Create MGRSLayer class extending BaseGridLayer
- [ ] 20.3 Set static layerName to 'MGRSLayer'
- [ ] 20.4 Implement constructor accepting MGRSLayerProps
- [ ] 20.5 Inject mgrsDefinition in super() call
- [ ] 20.6 Map gzdStyle prop to styleOverrides.GZD
- [ ] 20.7 Map grid100kmStyle prop to styleOverrides.GRID_100KM
- [ ] 20.8 Map grid10kmStyle prop to styleOverrides.GRID_10KM
- [ ] 20.9 Map grid1kmStyle prop to styleOverrides.GRID_1KM
- [ ] 20.10 Pass through showLabels, enableEvents, mapId props

### 21. MGRS Layer Types

- [ ] 21.1 Create `mgrs-layer/types.ts` file
- [ ] 21.2 Define MGRSLayerProps interface extending BaseGridLayerProps
- [ ] 21.3 Add gzdStyle?: Partial<GridStyleConfig>
- [ ] 21.4 Add grid100kmStyle?: Partial<GridStyleConfig>
- [ ] 21.5 Add grid10kmStyle?: Partial<GridStyleConfig>
- [ ] 21.6 Add grid1kmStyle?: Partial<GridStyleConfig>
- [ ] 21.7 Add zoomRanges?: GridZoomRange[] (optional override)
- [ ] 21.8 Export MGRS-specific grid type enum if needed

### 22. MGRS Layer Testing

- [ ] 22.1 Create `mgrs-layer/index.test.ts`
- [ ] 22.2 Write test for MGRSLayer construction
- [ ] 22.3 Write test for definition injection
- [ ] 22.4 Write test for style prop mapping
- [ ] 22.5 Write test for custom zoom ranges
- [ ] 22.6 Mock BaseGridLayer to verify correct props passed
- [ ] 22.7 Verify layerName is set correctly

### 23. MGRS React Fiber Support

- [ ] 23.1 Create `mgrs-layer/fiber.ts` file
- [ ] 23.2 Import registerLayerType from map-toolkit deckgl/react
- [ ] 23.3 Import MGRSLayer from index
- [ ] 23.4 Call registerLayerType('mgrsLayer', MGRSLayer)
- [ ] 23.5 Add fiber.ts path to package.json sideEffects array

### 24. MGRS Documentation

- [ ] 24.1 Create `mgrs-layer/mgrs-layer.docs.mdx`
- [ ] 24.2 Add overview section explaining MGRS grid system
- [ ] 24.3 Add installation instructions
- [ ] 24.4 Add basic usage example with code
- [ ] 24.5 Add styling customization examples
- [ ] 24.6 Add zoom range configuration examples
- [ ] 24.7 Add zone handling notes
- [ ] 24.8 Add event handling examples
- [ ] 24.9 Add React Fiber usage examples
- [ ] 24.10 Document MGRSLayerProps API

### 25. MGRS Storybook Stories

- [ ] 25.1 Create `mgrs-layer/mgrs-layer.stories.tsx`
- [ ] 25.2 Add "Default" story with basic MGRS layer
- [ ] 25.3 Add "Custom Styles" story with style overrides
- [ ] 25.4 Add "Custom Zoom Ranges" story
- [ ] 25.5 Add "Zone Boundaries" story demonstrating zone transitions
- [ ] 25.6 Add "Events" story demonstrating event bus
- [ ] 25.7 Add "React Fiber" story with JSX syntax
- [ ] 25.8 Add controls for interactive prop testing
- [ ] 25.9 Add map centering and zoom controls

## Phase 4: Package Configuration and Testing

### 26. Package Configuration

- [ ] 26.1 Update map-toolkit package.json optionalDependencies section
- [ ] 26.2 Add granular export for `./deckgl/grid-layers`
- [ ] 26.3 Add granular export for `./deckgl/grid-layers/gars-layer`
- [ ] 26.4 Add granular export for `./deckgl/grid-layers/gars-layer/fiber`
- [ ] 26.5 Add granular export for `./deckgl/grid-layers/mgrs-layer`
- [ ] 26.6 Add granular export for `./deckgl/grid-layers/mgrs-layer/fiber`
- [ ] 26.7 Add fiber.ts paths to sideEffects array
- [ ] 26.8 Create main `grid-layers/index.ts` with public exports
- [ ] 26.9 Export all types (GARSLayerProps, MGRSLayerProps, GridEvent, etc.)

### 27. Build and Type Checking

- [ ] 27.1 Run `pnpm build` in map-toolkit
- [ ] 27.2 Fix any TypeScript compilation errors
- [ ] 27.3 Run `pnpm type-check` to verify types
- [ ] 27.4 Verify all exports resolve correctly
- [ ] 27.5 Check bundle size impact
- [ ] 27.6 Verify tree-shaking works (unused grids not bundled)

### 28. Linting and Formatting

- [ ] 28.1 Run `pnpm lint` in map-toolkit
- [ ] 28.2 Fix any lint errors in grid-layers code
- [ ] 28.3 Run `pnpm format` to auto-fix formatting
- [ ] 28.4 Verify all files pass lint checks

### 29. Unit Test Execution

- [ ] 29.1 Run `pnpm test` for all grid-layers tests
- [ ] 29.2 Verify all BaseGridLayer tests pass
- [ ] 29.3 Verify all validation tests pass
- [ ] 29.4 Verify all GARS renderer tests pass
- [ ] 29.5 Verify all MGRS renderer tests pass
- [ ] 29.6 Verify all wrapper layer tests pass
- [ ] 29.7 Check test coverage (aim for >80%)
- [ ] 29.8 Fix any failing tests

### 30. Integration Testing

- [ ] 30.1 Create integration test file for GARS + event bus
- [ ] 30.2 Create integration test file for MGRS + event bus
- [ ] 30.3 Test GARS layer in React Fiber renderer
- [ ] 30.4 Test MGRS layer in React Fiber renderer
- [ ] 30.5 Test event emission and subscription
- [ ] 30.6 Test style override behavior end-to-end
- [ ] 30.7 Test zoom range configuration end-to-end

### 31. Performance Profiling

- [ ] 31.1 Create performance test with large viewport (world view)
- [ ] 31.2 Profile GARS rendering at various zoom levels
- [ ] 31.3 Profile MGRS rendering at various zoom levels
- [ ] 31.4 Measure event emission overhead
- [ ] 31.5 Check for memory leaks with repeated renders
- [ ] 31.6 Verify viewport bounds culling works correctly
- [ ] 31.7 Optimize if any performance issues found
- [ ] 31.8 Document performance characteristics

### 32. Storybook Validation

- [ ] 32.1 Run Storybook (`pnpm storybook`)
- [ ] 32.2 Test all GARS stories visually
- [ ] 32.3 Test all MGRS stories visually
- [ ] 32.4 Verify controls work in Storybook
- [ ] 32.5 Test React Fiber stories
- [ ] 32.6 Verify event logging in Storybook actions panel
- [ ] 32.7 Test zoom range transitions
- [ ] 32.8 Test style customization controls
- [ ] 32.9 Capture screenshots for documentation

## Phase 5: Publish and Validation

### 33. Pre-Release Validation

- [ ] 33.1 Review all documentation (MDX files)
- [ ] 33.2 Verify all code examples in docs are correct
- [ ] 33.3 Review type definitions for completeness
- [ ] 33.4 Run full test suite one more time
- [ ] 33.5 Verify build artifacts are correct
- [ ] 33.6 Test imports in a fresh project (create sandbox)
- [ ] 33.7 Verify optional dependencies install correctly

### 34. Alpha Release

- [ ] 34.1 Update map-toolkit version to 1.6.0-alpha.0 (or appropriate)
- [ ] 34.2 Create changeset with `pnpm changeset`
- [ ] 34.3 Document new grid-layers feature in changeset
- [ ] 34.4 Run `pnpm changeset:version` to update versions
- [ ] 34.5 Run `pnpm build` to create fresh build
- [ ] 34.6 Publish alpha to registry with `pnpm changeset:release --tag alpha`
- [ ] 34.7 Verify package published correctly
- [ ] 34.8 Test installing alpha in a test project

### 35. Alpha Testing

- [ ] 35.1 Create test project or use existing project
- [ ] 35.2 Install `@accelint/map-toolkit@alpha`
- [ ] 35.3 Install optional dependencies (@ngageoint/gars-js, @ngageoint/mgrs-js)
- [ ] 35.4 Import and use GARSLayer
- [ ] 35.5 Import and use MGRSLayer
- [ ] 35.6 Test event bus integration in real app
- [ ] 35.7 Test style customization
- [ ] 35.8 Test zoom range overrides
- [ ] 35.9 Test React Fiber usage
- [ ] 35.10 Verify TypeScript types work correctly
- [ ] 35.11 Test with different viewport sizes
- [ ] 35.12 Document any issues found

### 36. Bug Fixes and Iteration

- [ ] 36.1 Fix any issues discovered in alpha testing
- [ ] 36.2 Update documentation if needed
- [ ] 36.3 Run full test suite again
- [ ] 36.4 Publish alpha.1, alpha.2, etc. as needed
- [ ] 36.5 Retest in test project
- [ ] 36.6 Verify all issues resolved

### 37. Stable Release

- [ ] 37.1 Update map-toolkit version to 1.6.0 (or appropriate)
- [ ] 37.2 Create final changeset if needed
- [ ] 37.3 Run `pnpm changeset:version`
- [ ] 37.4 Run `pnpm build`
- [ ] 37.5 Run full test suite
- [ ] 37.6 Run `pnpm changeset:release` (without --tag alpha)
- [ ] 37.7 Verify package published correctly
- [ ] 37.8 Test installing stable version in test project
- [ ] 37.9 Verify npm page shows correct documentation

### 38. Documentation and Announcement

- [ ] 38.1 Update map-toolkit README with grid-layers section
- [ ] 38.2 Add migration guide for projects (if applicable)
- [ ] 38.3 Create example project showcasing grid layers
- [ ] 38.4 Add grid-layers to map-toolkit feature list
- [ ] 38.5 Document event bus patterns for grid interactions
- [ ] 38.6 Add troubleshooting section (optional dependencies, etc.)
- [ ] 38.7 Announce to standard-toolkit projects (Teams, etc.)
- [ ] 38.8 Update relevant project documentation

### 39. Future Enhancements (Backlog)

- [ ] 39.1 Consider adding UTM grid system
- [ ] 39.2 Consider adding H3 grid system
- [ ] 39.3 Consider adding S2 grid system
- [ ] 39.4 Consider selection overlay layer
- [ ] 39.5 Consider exposing GridRenderer interface publicly
- [ ] 39.6 Consider additional event types (viewport change, etc.)
- [ ] 39.7 Monitor performance in production usage
- [ ] 39.8 Gather feedback from consumers for improvements
