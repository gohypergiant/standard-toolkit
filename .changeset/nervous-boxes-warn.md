---
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
