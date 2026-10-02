## Why

Add a bearing-and-range measurement tool to @accelint/map-toolkit to enable operators to measure great-circle distance and true bearing between two points on the map. This is a core tactical capability for C2 applications. Currently, no measurement tools exist in map-toolkit.

## What Changes

- Add a new composite deck.gl layer for bearing-and-range measurement
- Implement drag-to-measure interaction using BaseMap's existing drag handlers
- Display great-circle distance in kilometers and nautical miles
- Display true bearing (0-360°) at the line's midpoint
- Expose measurement activation/deactivation via bus events following the map-mode pattern
- Suppress pan during measurement drag
- Integrate @turf/turf functions (already in map-toolkit) for distance and bearing calculations
- Implement bearing and azimuth formatters in @accelint/formatters (currently empty stubs)

## Capabilities

### New Capabilities
- `bearing-range-measurement`: Interactive drag-to-measure tool providing great-circle distance (km + NM) and true bearing (0-360°) between two map points, rendered at the line's midpoint

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

**Affected Packages:**
- `@accelint/map-toolkit` — new bearing-range layer + measurement logic (minor bump)
- `@accelint/formatters` — implement bearing/azimuth formatters currently stubbed (minor bump)

**Known Downstream Dependents:**
- apps/next demo app will be able to showcase the new measurement capability

**Breaking Changes:** None

**Changeset Bump:** minor (new feature in both packages)