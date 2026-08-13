---
'@accelint/design-toolkit': major
---

Upgrade Table to TanStack Table v9 (`@tanstack/react-table` peer dependency is now `^9.0.0`).

BREAKING CHANGES for Table consumers:

- The `@tanstack/react-table` peer dependency must be upgraded to `^9.0.0`.
- Column definitions are now typed against the Table's feature set. Replace
  `createColumnHelper<TData>()` with the new `createTableColumnHelper<TData>()`
  export, or pass the new `TableFeatures` type as the first generic of TanStack
  types (`ColumnDef<TableFeatures, TData, TValue>`, `CellContext<TableFeatures,
  TData, TValue>`, etc.). The registered feature set is exported as
  `tableFeatures`.
- The `columns` prop is now `ColumnDef<TableFeatures, T, any>[]` (mirroring
  TanStack's own columns typing) instead of a per-key mapped type; column
  helper output assigns to it directly.
- `TableBodyProps`, `TableRowProps`, `TableCellProps`, `TableHeaderCellProps`,
  and `TableHeaderProps` now constrain their generic to TanStack's `RowData`
  (`Record<string, any> | Array<any>`).
- `RowSelectionState` in v9 is `Record<string, true>`; update any
  `Record<string, boolean>` selection state accordingly.
- Behavior note: TanStack Table v9 renders function `cell`/`header` renderers
  as React components (v8 called them inline). A column definition recreated
  on each render therefore remounts its cells on each render, resetting any
  internal cell state (open menus, focus). Define columns at module scope or
  memoize them with stable dependencies.
