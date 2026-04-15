---
"@accelint/map-toolkit": patch
---

fix: support multiple coffin-corner layers per map without breaking deck.gl/maplibre viewport sync

`useCoffinCorner` previously stored each layer's `getEntityId` accessor inside
the reactive store. When a second layer registered, the shared state reference
changed, triggering `useSyncExternalStore`'s post-commit snapshot-consistency
check. The resulting mid-mount re-render desynced deck.gl's viewport from
maplibre's on pan/zoom whenever two or more layers used the hook on the same map.

Layer registration now lives in a non-reactive module-level registry. Reactive
state holds only `selectedId` and `hoveredId`, which update exclusively via
genuine user interaction through the map bus. The store is now multi-layer
aware: `LayerState` is keyed by `layerId` inside a `Map`, and all bus payloads
carry a `layerId`. Actions and bus handlers receive their owning `mapId` via
closure rather than storing it in state.

**Breaking changes for direct store consumers:**

- `CoffinCornerSelectedEvent`, `CoffinCornerDeselectedEvent`, and
  `CoffinCornerHoveredEvent` payloads now include a required `layerId: string`
  field.
- `getSelectedEntityId(mapId)` and `getHoveredEntityId(mapId)` now require a
  `layerId` argument: `getSelectedEntityId(mapId, layerId)`.
- `clearSelection(mapId)` still clears the whole map; pass an optional
  `layerId` to clear a single layer's state.
- The `setLayerId` and `setGetEntityId` store actions are removed — use
  `useCoffinCorner` (which handles registration) instead.

`useCoffinCorner`'s public API is unchanged.
