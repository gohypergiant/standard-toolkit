---
"@accelint/map-toolkit": major
---

Refactor map-toolkit for v1 release:

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
