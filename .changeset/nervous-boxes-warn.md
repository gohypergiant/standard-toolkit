---
"@accelint/map-toolkit": patch
---

fix: prevent unnecessary rerenders in useCoffinCorner on mount

Two changes work together to eliminate a startup rerender that was breaking deck.gl/maplibre sync:

1. `useCoffinCorner` now seeds `layerId` and `getEntityId` into the store via `setInitialState` before `use()` subscribes and sets up the bus. Because `setInitialState` writes directly without calling `notify()`, no rerender is triggered and the `useEffect`s that previously set these values on first mount become no-ops.

2. The store's `onClick` and `onHover` handlers now guard against processing events when `layerId` is undefined (before the hook mounts or after unmount), matching the pattern from the draw store fix (#968).
