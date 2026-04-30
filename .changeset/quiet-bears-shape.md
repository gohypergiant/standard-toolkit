---
"@accelint/map-toolkit": minor
---

Tightened bus event payload types to satisfy `@accelint/bus`'s `StructuredCloneable` constraint, and tightened `useDrawShape().draw()` to reject undrawable shape types.

- **Added `BusCloneable<T>`** (re-exported from `@accelint/map-toolkit/deckgl/shapes`): type-level helper that lets event payloads carrying GeoJSON `Feature`/`Shape` data satisfy the bus's `StructuredCloneable` constraint. GeoJSON data is cloneable at runtime but lacks the index signature that type-fest's `StructuredCloneable` requires of plain object types; `BusCloneable<T>` adds that signature via intersection. Use it when defining custom event payloads that carry shape data.
- **Added `DrawableShapeType`** (re-exported from `@accelint/map-toolkit/deckgl/shapes`): `Exclude<ShapeFeatureType, 'WagonWheel'>`. Wagon wheels can't be interactively drawn — they need additional metadata (spokes, orientation, range rings) that a draw interaction can't collect, so they're constructed programmatically and edited via the EditShapeLayer.
- **Narrowed `useDrawShape().draw()`** parameter from `ShapeFeatureType` to `DrawableShapeType`. This catches the previously unguarded potential runtime crash where `draw('WagonWheel')` would pass `undefined` to deck.gl. Callers that already pass concrete enum values (`ShapeFeatureType.Circle`, etc.) are unaffected; callers passing an arbitrary `ShapeFeatureType` will need to narrow to `DrawableShapeType` or handle the wagon-wheel case separately.
- Cleared the related TypeScript errors in `useBus<EditShapeEvent>`, `useBus<DrawShapeEvent>`, and the corresponding broadcast/store sites.
