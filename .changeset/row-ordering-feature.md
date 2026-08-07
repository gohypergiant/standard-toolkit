---
'@accelint/design-toolkit': minor
---

Table's manual row ordering (Move Up / Move Down) is now implemented as a
TanStack Table custom feature. New `rowOrderingFeature` export (with
`RowOrderingState`, `RowOrderingTableState`, `RowOrderingTableOptions`,
`RowOrderingTableApis`, and `RowOrderingRowApis` types) registers a
`rowOrdering` state slice, an identity-stable `table.setRowOrdering` state
setter, and `row.moveUp()` / `row.moveDown()` row APIs.

Fixes: an open row kebab menu no longer closes when the `data` prop updates
mid-interaction (the move callbacks previously lived in component state, and
their churn remounted the kebab cells on every data change).

Fixes: moves now interact correctly with pinned rows. Pinned rows render in
their own region, so moving relative to one had no visible effect; moves now
skip pinned neighbors, and the new `row.getCanMoveUp()` / `row.getCanMoveDown()`
APIs (which drive the kebab menu's disabled states) report whether an unpinned
row exists to move past.
