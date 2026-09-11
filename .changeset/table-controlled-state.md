---
'@accelint/design-toolkit': major
---

Give Table one controlled-state convention: every Table-owned state slice is exposed as `x` / `defaultX` / `onXChange`, uncontrolled by default, controlled when `x` is provided, with change callbacks receiving plain values.

BREAKING CHANGES:

- `rowSelection` is now the controlled value of the selection slice. It was previously read only on mount as an initial value, so later prop changes never reached the table. For uncontrolled usage pass `defaultRowSelection` as the starting selection and the table manages it from there; keep `rowSelection` (paired with `onRowSelectionChange`) to drive selection from your own state. A static `rowSelection` with no callback now renders a frozen selection.
- `onRowSelectionChange` receives the plain next `RowSelectionState` instead of TanStack's updater-or-value. Wiring a `useState` setter keeps working unchanged; remove any `typeof updater === 'function'` branches, which are now dead code.
- `onSortChange` receives the plain next `SortingState` in both client-side and `manualSorting` modes, instead of `(columnId, direction)` in `manualSorting` mode only. Read `sort[0]?.id` and `sort[0]?.desc` in place of the old arguments; an empty array means sorting was cleared.

New:

- `defaultRowSelection`: initial row selection for uncontrolled use.
- `rowPinning` / `defaultRowPinning` / `onRowPinningChange`: the row pinning slice (previously internal) is now controllable; the row kebab Pin / Unpin actions are unchanged.
- `sort` / `defaultSort`: the sort slice is now controllable. In `manualSorting` mode the sort indicator, the menu items' disabled states, and `aria-sort` now reflect the active sort.

The state value types (`RowSelectionState`, `RowPinningState`, `SortingState`) are not re-exported; import them from the `@tanstack/react-table` peer dependency.
