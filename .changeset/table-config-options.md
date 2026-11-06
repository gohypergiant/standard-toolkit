---
"@accelint/design-toolkit": minor
---

Adds a `configOptions` prop to `Table` that accepts any TanStack table option (e.g. `defaultColumn`, `initialState`, `getRowId`, `enableRowSelection`, `onColumnSizingChange`) and spreads it into `useTable`.

- Options the Table sets from its own props (`data`, `columns`, `features`, `state`, `enableSorting`, `manualSorting`, `manualPagination`, and the sorting, selection, pinning, row ordering and pagination change handlers) are applied after `configOptions` and take precedence.
- Callbacks for slices the Table does not own, such as `onColumnSizingChange`, receive TanStack updaters rather than plain values.
- `configOptions` is not available when `Table` is used with `children`.
