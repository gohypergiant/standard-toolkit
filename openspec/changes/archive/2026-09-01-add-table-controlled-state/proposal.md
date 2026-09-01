## Why

`Table` in `@accelint/design-toolkit` manages five state slices with three different
ownership models, and two of them are broken from a consumer's point of view:
the `rowSelection` prop is read only by a `useState` initializer (`index.tsx:199-201`)
so post-mount prop changes never reach the table, and in `manualSorting` mode
nothing writes TanStack's sorting state (`index.tsx:301-306`), so `getIsSorted()` is
always `false`: no sort arrow, `aria-sort` never set, "Clear Sort" permanently
disabled. Only `page` follows the house `x` / `defaultX` / `onXChange` pattern
(`useControlledState`, `index.tsx:208-212`). Two follow-up changes
(`simplify-table-row-ordering`, `fix-table-column-order`) need a single controlled-state
convention to adopt, so it must be defined once, here, before they land.

## What Changes

- Define the Table controlled-state convention: per slice `x` / `defaultX` / `onXChange`,
  implemented with `useControlledState` from `react-stately/useControlledState`;
  uncontrolled by default, controlled when `x !== undefined`; consumer callbacks
  receive plain values (TanStack `Updater<T>` functions are resolved inside Table);
  no prop-to-state effects; no runtime mode switching.
- Add a small internal adapter hook (`// __private-exports`) that returns
  `[value, OnChangeFn<T>]` so every slice, including the sibling changes' slices,
  wires into `useTable({ state, onXChange })` the same way.
- **BREAKING** `rowSelection` becomes the controlled value (was initial-only).
  New `defaultRowSelection` carries the old initial-only meaning.
- **BREAKING** `onRowSelectionChange` receives a plain `RowSelectionState`, never an
  updater function. `setState` callers keep working; handlers that branch on
  `typeof updater === 'function'` compile but that branch becomes dead code.
- Add `rowPinning` / `defaultRowPinning` / `onRowPinningChange` (currently internal only).
- Add `sort` / `defaultSort` (`SortingState`) and feed `sort` into `useTable` `state`
  in both manual and client-side modes so the arrow icon, menu item disabled states,
  and `aria-sort` reflect the sort in `manualSorting` mode.
- **BREAKING** `onSortChange` becomes the triple's callback: plain `SortingState` in
  both modes (was `(columnId, direction)` in `manualSorting` only); no second callback.
- `columnSelection` stays internal (transient header-menu-open / column-highlight UI state).
- `page` / `defaultPage` / `onPageChange` is unchanged and is the reference implementation.
- Tests, stories, `table.docs.mdx`, and `apps/docs` table page updated to match;
  `apps/next` visual scenarios switch static `rowSelection` to `defaultRowSelection`.

## Capabilities

### New Capabilities
- `table-state-management`: controlled/uncontrolled contract for Table-owned state
  slices (`rowSelection`, `rowPinning`, `sorting`, `page`), the naming triple,
  plain-value callbacks, and the internal adapter contract sibling changes reuse.
- `table-sorting`: sort menu behavior in client-side and `manualSorting` modes,
  `aria-sort` and icon reflecting sort state, `onSortChange(SortingState)` contract.

### Modified Capabilities
None. No existing spec covers Table (`openspec/specs/INDEX.md` lists 12 capabilities,
none `table-*`).

## Out of Scope

- Density / `variant` prop and its CSS: owned by `add-table-density-variant`.
- `row-ordering-feature.ts`, the data reorder memo, and
  `rowOrdering` / `defaultRowOrdering` / `onRowOrderingChange`: owned by
  `simplify-table-row-ordering` (it adopts the adapter defined here).
- `columnOrder` / `defaultColumnOrder` / `onColumnOrderChange`, meta-column placement,
  `onColumnReorderChange` semantics, `showNumerals`: owned by `fix-table-column-order`.
- Header-click / keyboard sort trigger (none exists today; sorting stays in the kebab menu).
- Multi-column sort, per-column `enableSorting` / `getCanSort()`, bottom pinning UI.
- Removing the dead `TableHeaderProps.columnSelection` prop or any
  `TableContextValue` field (each would be a separate breaking decision).
- Memoizing the `TableContext` provider value or wrapping subcomponents in `memo`.
- Re-exporting TanStack state types; consumers import them from the
  `@tanstack/react-table` peer, as `apps/next` already does.

## Impact

**Workspace packages touched**
- `packages/design-toolkit` (source): `components/table/index.tsx`, `types.ts`,
  `header-cell.tsx`, new `components/table/use-table-controlled-state.ts`,
  `table.test.tsx`, `table-pagination.test.tsx`, `table.stories.tsx`, `table.docs.mdx`.
- `apps/next` (private, tests only): `src/features/table/table.visual.tsx` and
  `variants.ts` switch to `defaultRowSelection`.
- `apps/docs` (private, docs only): `content/docs/toolkits/design-toolkit/components/table.mdx`.

**Known in-repo downstream dependents of `Table`**: `apps/next` only
(`table.visual.tsx`); no other app or package imports it.

**Public API**
- Breaking: `rowSelection` semantics (initial-only -> controlled); the
  `onRowSelectionChange` argument shape (updater-or-value -> plain value); the
  `onSortChange` argument shape (`(columnId, direction)` -> `SortingState`).
- Additive: `defaultRowSelection`, `rowPinning`, `defaultRowPinning`,
  `onRowPinningChange`, `sort`, `defaultSort`.
- Unchanged: `TableContext`, `TableContextValue`, `TableHeaderProps`, all exports
  in `src/index.ts`; `TableProps` children branch gains `?: never` entries
  automatically via its mapped type (`types.ts:207`).

**Dependencies**: none added (`react-stately`, `@tanstack/react-table` already peer + dev).

**Changeset**: `@accelint/design-toolkit` **major** (10.0.0 -> 11.0.0), listing the
three breaking items with migration steps (`rowSelection` -> `defaultRowSelection`;
drop updater branches in `onRowSelectionChange`; read `sort[0]?.id` / `.desc` in `onSortChange`).
No changeset for `apps/next` or `apps/docs` (private).

**Accessibility**: `aria-sort` becomes correct in `manualSorting` mode; nothing else changes.
