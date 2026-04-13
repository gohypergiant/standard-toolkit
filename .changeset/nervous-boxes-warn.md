---
"@accelint/map-toolkit": patch
---

fix: prevent useCoffinCorner from processing events before layer is configured

The coffin corner store's `onClick` and `onHover` handlers were processing all map events even when `layerId` was undefined (before the hook's `useEffect` ran or during unmount). This caused unnecessary event processing and could lead to unexpected state updates.

The fix adds guards to skip processing when no layer is configured, matching the pattern from the draw store fix (#968).
