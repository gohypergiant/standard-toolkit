---
<<<<<<< feat/add-coffin-corner-multi-select
"@accelint/map-toolkit": major
---

Refactor CoffinCornerExtension to a pure rendering primitive

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
=======
"@accelint/map-toolkit": minor
---

Fix viewport desync when multiple coffin-corner layers share a map, and add multi-layer support to `useCoffinCorner`

Using two or more `useCoffinCorner` hooks on the same `BaseMap` caused deck.gl's viewport to desync from maplibre's on pan/zoom. This happened because registering a second layer triggered a mid-mount re-render via `useSyncExternalStore`. Layer registration is now non-reactive, so adding layers no longer causes re-renders.

`useCoffinCorner`'s hook API is unchanged. The store and imperative APIs now require a `layerId` parameter to support multiple layers per map:

- `getSelectedEntityId(mapId, layerId)` and `getHoveredEntityId(mapId, layerId)` now require `layerId`
- `clearSelection(mapId, layerId?)` accepts an optional `layerId` to clear a single layer
- Store actions `setSelectedId` and `deselect` now take `layerId` as the first argument
- Event payloads (`CoffinCornerSelectedEvent`, `CoffinCornerDeselectedEvent`, `CoffinCornerHoveredEvent`) include a required `layerId` field
- `setLayerId` and `setGetEntityId` store actions are removed — use `useCoffinCorner` or `registerCoffinCornerLayer` instead
>>>>>>> fix/use-coffin-corner-rerenders
