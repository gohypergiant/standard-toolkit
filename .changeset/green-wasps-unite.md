---
"@accelint/map-toolkit": patch
---

fix: add persistent viewport sync to BaseMap for deck.gl picking accuracy

deck.gl's `getDeckInstance` registers a `map.on('move')` listener to sync the picking viewport with MapLibre's camera. However, that listener self-deregisters if `deck.isInitialized` is false on the first `move` event. When module pre-bundling (e.g. Vite `optimizeDeps`) changes the loading order, MapLibre can fire its initial `move` event before the Deck instance finishes initializing, permanently killing the viewport sync. This causes `PickingInfo.coordinate` to return stale coordinates after any pan or zoom. This was observable in recipes.

The fix adds a persistent `map.on('move')` listener via a `useControl` hook in `AddDeckglControl` that mirrors the `onMapMove` logic from `@deck.gl/mapbox` without the self-deregister behavior.
