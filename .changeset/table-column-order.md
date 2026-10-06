---
"@accelint/design-toolkit": patch
---

Fix `Table` not updating column order after mount. `columnOrder` was seeded once through TanStack's `initialState`, so manual reorders (via the header kebab's "Move Column Left/Right") never persisted and later `columns` prop changes never adjusted the order. `columnOrder` is now tracked as reactive state wired through `useTable`'s `state` and `onColumnOrderChange`, matching the pattern already used for row selection, row pinning, sort, and row ordering.
