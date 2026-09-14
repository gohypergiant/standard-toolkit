---
change: add-table-controlled-state
created_at: "2026-09-01T15:53:44.000Z"
started_at: "2026-09-01T18:38:07.000Z"
completed_at: "2026-09-01T19:15:18.000Z"
specs_touched: [table-state-management, table-sorting]
decisions:
  - id: D1
    choice: House convention for Table-owned state - per slice x / defaultX / onXChange via useControlledState; uncontrolled by default, controlled when x !== undefined; callbacks receive plain resolved values; no prop-to-state effects; no runtime mode switching
    rationale: Matches .agents/react.md, openspec/config.yaml anti-patterns, the stepper-state-management spec and all six existing useControlledState call sites; every other on* callback in the package passes a plain value
    alternatives: [keep TanStack updater-or-value callback shape, expose TanStack atoms option]
  - id: D2
    choice: Thin private adapter useTableControlledState<T>(value, defaultValue, onChange?) returning [T, OnChangeFn<T>] in use-table-controlled-state.ts (// __private-exports)
    rationale: useControlledState's setter already resolves functional updaters and emits the plain value, so the hook adds only the single import, the OnChangeFn return type and one JSDoc home for the convention that simplify-table-row-ordering and fix-table-column-order reuse
    alternatives: [inline useControlledState per slice, multi-slice hook returning state and handlers]
  - id: D3
    choice: rowSelection becomes a controlled triple - rowSelection (controlled), defaultRowSelection (initial), onRowSelectionChange(RowSelectionState); dead initialState.rowSelection dropped (BREAKING, major)
    rationale: The prop is documented and used as controlled but behaves as initial-only, and the callback leaks TanStack updaters; both are public-API breaks that drive the design-toolkit major
    alternatives: [keep rowSelection initial-only and add selectedRows, dual-shape callback]
  - id: D4
    choice: rowPinning becomes a controlled triple - rowPinning / defaultRowPinning / onRowPinningChange(RowPinningState); row.pin path unchanged (additive)
    rationale: The slice already exists internally; exposing it costs one adapter call and lets consumers persist pins across data refetches
    alternatives: [leave rowPinning internal]
  - id: D5
    choice: sort becomes a controlled triple - sort / defaultSort / onSortChange(SortingState); sort is passed as state.sorting; handleSortChange writes setSort in both client and manualSorting modes; header-cell.tsx manualSorting ternaries removed; manualSorting only skips the client-side sorted row model
    rationale: Feeds TanStack's sorting atom so getIsSorted, the arrow icon, menu isDisabled flags and aria-sort are correct in manual mode; keeps TableContextValue byte-identical; single-column result matches toggleSorting/clearSorting today
    alternatives: [keep header.column.toggleSorting in client mode, write TanStack atoms, sorting/defaultSorting/onSortingChange plus deprecated onSortChange]
  - id: D6
    choice: onSortChange keeps its name and changes payload to the plain SortingState in both modes; no deprecation period, no second callback (BREAKING, folded into the D3 major)
    rationale: Decided at checkpoint 1 - one callback per slice and one migration; old two-argument handlers fail to compile so the break is loud; no in-repo caller passes onSortChange
    alternatives: [deprecate onSortChange and add onSortingChange, remove onSortChange and add onSortingChange]
  - id: D7
    choice: columnSelection stays internal; page / defaultPage / onPageChange unchanged (gains only a defaultPage test)
    rationale: columnSelection is transient header-menu-open state doubling as the column highlight with no consumer; page already follows the convention with a legitimate 1-indexed adapter
    alternatives: [expose columnSelection as a controlled triple]
  - id: D8
    choice: SortingState, RowSelectionState and RowPinningState are not re-exported; consumers import them from the @tanstack/react-table peer
    rationale: apps/next already imports them from the peer; re-exporting duplicates a peer's types under a second name
    alternatives: [re-export the TanStack state types from design-toolkit]
---
## Context

See proposal.md - Why. Paths below are relative to
`packages/design-toolkit/src/components/table/` unless stated.

### Current State

Five state hooks in `index.tsx`, three ownership models:

| slice | hook | `useTable` `state` | prop surface today |
|---|---|---|---|
| `rowSelection` | `useState(rowSelectionProp ?? {})` (:199) | yes (:340) + dead `initialState` (:337) | `rowSelection` (initial-only), `onRowSelectionChange(updaterOrValue)` |
| `rowPinning` | `useState({top:[],bottom:[]})` (:203) | yes (:341) | none |
| `sorting` | none; TanStack base atom | no | `manualSorting`, `onSortChange(columnId, dir)` |
| `columnSelection` | `useState<string\|null>` (:202) | no (context only) | none (dead `TableHeaderProps.columnSelection`) |
| `page` | `useControlledState(pageProp, defaultPage, onPageChange)` (:208) | derived `pagination` (:214) | `page` / `defaultPage` / `onPageChange` |

Data flow for the two broken paths:

```
rowSelection prop ──> useState initializer (first render only) ──> state.rowSelection
                 └──> initialState.rowSelection (pinned at construct; never read)
later prop change ──> nothing                                   <-- bug

checkbox ──> row.toggleSelected ──> onRowSelectionChange(fn)  [TanStack always emits fn]
         ──> handleRowSelectionChange: setRowSelection(fn); onRowSelectionChange?.(fn)
                                                               ^ consumer gets a function

manualSorting: menu item ──> handleSortChange ──> onSortChange(id, dir)   [context]
               atoms.sorting stays []  ──> getIsSorted() false ──> no icon,
               aria-sort undefined, "Clear Sort" disabled       <-- bug
client sorting: menu item ──> header.column.toggleSorting/clearSorting ──> base atom
```

Facts that shape the approach (all verified against installed sources):
- `useControlledState` (react-stately 3.46.0): controlled iff `value !== undefined`;
  setter resolves `(prev) => next` against a ref and calls `onChange` synchronously
  with the resolved value; skips when `Object.is`-equal; warns (non-prod) on mode
  switch; seeds uncontrolled state with `value || defaultValue`. Its setter type
  `(value: SetStateAction<T>) => void` is structurally identical to TanStack's
  `OnChangeFn<T> = (updaterOrValue: T | ((old: T) => T)) => void`.
- TanStack v9: per-slice readonly atoms, precedence `options.state[key]` >
  base atom; `useTable` re-merges options every render and syncs controlled
  slices in a layout effect; `manualSorting` is read only by
  `table_getSortedRowModel`, so `state.sorting` + `manualSorting` drives
  `getIsSorted()` / `aria-sort` without sorting rows client-side.
  `row.pin`, `row.toggleSelected`, `table.toggleAllRowsSelected` all emit functions.
- `TableProps` children branch is a mapped type over `keyof ExtendedTableProps<T>`
  (`types.ts:207`); new props get `?: never` automatically.
- `origin/fix/table-column-order-density` keeps `const table = useTable(...)`
  and leaves `state`, handlers, `TableContextValue`, `context.tsx` untouched.

### Desired End State

```
consumer props                 Table (index.tsx)                      TanStack useTable
--------------                 ------------------------------------   -----------------
rowSelection ─┐
defaultRowSelection ─┼─> useTableControlledState ─> [rowSelection, setRowSelection]
onRowSelectionChange ─┘        (plain value out)     │              │
                                                     └─ state.rowSelection
                                                                    └─ onRowSelectionChange
rowPinning / defaultRowPinning / onRowPinningChange  ──> same shape ──> state.rowPinning
sort / defaultSort / onSortChange(SortingState)      ──> same shape ──> state.sorting
page / defaultPage / onPageChange (unchanged)        ──> pagination memo (existing)
columnSelection: useState, context only (unchanged)
```

Both sort modes write the same state: `handleSortChange(columnId, dir)` (already in
context, signature unchanged) calls `setSort(dir ? [{ id, desc }] : [])`, which
resolves, updates the atom via `state.sorting`, and fires `onSortChange(next)` with
the plain `SortingState`. `getIsSorted()`, the arrow icon, the menu `isDisabled`
flags and `aria-sort` become correct in `manualSorting` mode with no change to
`header-cell.tsx` beyond deleting the `manualSorting ? ... :` ternaries.

What stays the same: `TableContext`, `TableContextValue`, `TableHeaderProps`, the
`page` implementation, `columnSelection`, `getRowId`, `enableRowPinning: true`,
the kebab menus, row/cell DOM attributes, all `src/index.ts` exports.

## Goals / Non-Goals

**Goals:** one convention and one adapter that `simplify-table-row-ordering` and
`fix-table-column-order` can adopt for `rowOrdering` and `columnOrder` without
redesign; correct sort affordances and `aria-sort` in `manualSorting` mode;
`rowSelection` actually controllable; explicit semver accounting.

**Non-Goals:** the sibling-owned slices and props listed in proposal.md - Out of
Scope; new sort triggers (header click / keyboard); multi-sort; context memoization.

## Resolved Decisions

**Decision 1: House convention for Table-owned state.**
Choice: per slice `x` / `defaultX` / `onXChange`; uncontrolled by default, controlled
when `x !== undefined`; `onXChange` receives the plain resolved value; no prop-to-state
effects; no runtime mode switching (the react-stately dev warning enforces it).
Rationale: matches `.agents/react.md:35,40,41,61`, `openspec/config.yaml:220-222`,
the `stepper-state-management` spec, and the six existing `useControlledState` call
sites (pagination, input, slider, stepper, combobox-field, table `page`). Every other
`on*` in the package passes a plain value except Input (DOM event) and Table's own
updater leak. Alternatives: keep TanStack's updater-or-value shape (rejected: no
other component exposes it, forces consumers to resolve state themselves);
`atoms` option (rejected: TanStack-specific API leaking into props).

**Decision 2: A thin internal adapter hook, `useTableControlledState`.**
Choice: new file `use-table-controlled-state.ts`, first line `// __private-exports`
(keeps it out of the generated `src/index.ts`; `use-*.ts` satisfies ls-lint):
```ts
export function useTableControlledState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, OnChangeFn<T>] {
  return useControlledState(value, defaultValue, onChange);
}
```
Rationale: the bridge is `useControlledState` itself (its setter already resolves
functional updaters and emits the plain value), so the hook adds no logic; its value
is the single import, the `OnChangeFn<T>` return type that plugs straight into
`useTable({ state, onXChange })`, and one JSDoc home for the convention that the
sibling changes reuse for `rowOrdering` / `columnOrder`. Works whether the caller
destructures `useTable` or keeps the whole `table` instance. Alternatives: call
`useControlledState` inline four times (rejected: convention lives in nobody's
head, siblings re-derive the typing); a generic multi-slice hook returning
`{ state, handlers }` (rejected: more machinery than the problem needs).

**Decision 3: `rowSelection` becomes a controlled triple (BREAKING, major).**
Choice: `rowSelection` (controlled), `defaultRowSelection` (initial),
`onRowSelectionChange(rowSelection: RowSelectionState)`. Wire
`onRowSelectionChange: setRowSelection` from the adapter; drop the dead
`initialState.rowSelection`. Rationale: the prop is documented as controlled in
`table.docs.mdx:134` and used that way in the `InitialRowSelection` story, yet
behaves as initial-only; the callback shape leaks TanStack. Semver: two breaking
items (prop semantics; callback argument) -> `@accelint/design-toolkit` major.
Alternatives: keep `rowSelection` initial-only and add `selectedRows` (rejected:
two names for one slice, diverges from the convention); dual-shape callback
(rejected: cannot be typed honestly, still leaks updaters).

**Decision 4: `rowPinning` becomes a controlled triple (additive).**
Choice: `rowPinning` / `defaultRowPinning` / `onRowPinningChange(RowPinningState)`;
`onRowPinningChange: setRowPinning`. `row.pin` in `RowActionsMenu` is unchanged.
Rationale: the slice already exists internally; exposing it costs one adapter call
and lets consumers persist pins across data refetches (`LiveUpdates` use case).
Alternative: leave internal (rejected: it is the only remaining `useState` slice fed
to `useTable`, and siblings should not have to model an exception).

**Decision 5: `sort` becomes a controlled triple; one write path for both modes.**
Choice: `sort` / `defaultSort` / `onSortChange(sort: SortingState)`; `sort` is passed
as `state.sorting` to `useTable`, `onSortingChange: setSort`. `handleSortChange`
(context, signature unchanged, now `useCallback`) writes
`setSort(dir ? [{ id: columnId, desc: dir === 'desc' }] : [])`; the adapter fires
`onSortChange(next)`. `header-cell.tsx` calls `handleSortChange` in both modes (the
ternaries at :115-137 go away). `manualSorting` only skips the client-side sorted
row model. The consumer name is `sort` (`x` = `sort` reuses `onSortChange`), as
`page` already renames TanStack's `pagination`.
Rationale: fixes the manual-mode affordances at the root (the atom is fed), keeps
`TableContextValue` byte-identical (public type); the single-column result is what
`toggleSorting(desc)` / `clearSorting()` produce today without multi-sort.
Alternatives: keep `header.column.toggleSorting` in client mode (two write paths);
write TanStack `atoms` (Decision 1); `sorting` / `defaultSorting` / `onSortingChange`
plus a deprecated `onSortChange` (rejected at checkpoint 1: two callbacks, two migrations).

**Decision 6: `onSortChange` keeps its name and changes payload (BREAKING, major).**
Choice: `onSortChange` receives the plain `SortingState` (`[{ id, desc }]` or `[]`)
in both modes instead of `(columnId, 'asc' | 'desc' | null)` in manual mode only.
Semver: breaking, folded into the major Decision 3 already requires; old
two-argument handlers fail to compile (`string` vs `SortingState`), so the break is
loud. No in-repo caller passes `onSortChange`. Alternative: deprecate + add
`onSortingChange` (rejected at checkpoint 1, Decision 5).

**Decision 7: `columnSelection` stays internal; `page` unchanged.**
Rationale: `columnSelection` is "which header menu is open" doubling as the column
highlight (`header-cell.tsx:70-72`, `cell.tsx:50`); it is transient UI state with no
consumer, so no triple. `page` already follows the convention and its
`handlePaginationChange` (1-indexed conversion) is a legitimate non-identity
adapter; it gains only a `defaultPage` unit test.

**Decision 8: TanStack state types are not re-exported.**
`SortingState`, `RowSelectionState`, `RowPinningState` come from the
`@tanstack/react-table` peer, as `apps/next/src/features/table/variants.ts:13`
already does. Re-exporting would duplicate a peer's types under a second name.

## Patterns to Follow
- `index.tsx:208-230` (`page` via `useControlledState`, `handlePaginationChange`).
- `stepper/use-stepper-state.ts:217-228` (`defaultX ?? EMPTY_*` stable defaults).
- `table-pagination.test.tsx:49-67` (controlled wrapper component in tests).
- Import path `react-stately/useControlledState` only (all six call sites).

## Patterns to Avoid
- `useEffect` copying a prop into state (`.agents/react.md:41`); the current
  `useState(rowSelectionProp ?? {})` is the half-version of this bug.
- Forwarding TanStack `Updater<T>` functions to consumer callbacks (`index.tsx:320`).
- Passing `initialState` for a slice that is also in `state` (dead after first render).

## Accessibility
- Fixed: `<th aria-sort>` (`header-cell.tsx:191`) and the sort menu items'
  `isDisabled` now reflect the active sort in `manualSorting` mode; screen readers
  announce the sorted column, keyboard users see which menu action applies.
- Unchanged: sort and pin actions remain in the RAC `MenuTrigger` kebab menus
  (keyboard-operable, focus-managed by react-aria). No header-click or
  keyboard-shortcut sort trigger is added; the `SortableColumns` story text that
  claims "click a header" is corrected to describe the menu.
- Left as-is (out of scope): rows expose `data-selected` / `data-pinned` only, no
  `aria-selected`; `aria-sort` is `undefined` rather than `"none"` on unsorted columns.

## Storybook
- Update `InitialRowSelection`: use `defaultRowSelection` (matches its name) and
  render `onRowSelectionChange` output to show plain-value callbacks.
- Add `ControlledRowSelection`: external state, a "Clear selection" button proving
  the prop drives the checkboxes after mount.
- Add `ControlledSorting`: `sort` / `onSortChange` with state displayed.
- Add `ServerSideSorting`: `manualSorting` + controlled `sort`; data sorted in the
  story; demonstrates the arrow icon and `aria-sort` in manual mode.
- Add `ControlledRowPinning`: `defaultRowPinning` seed plus an "Unpin all" button
  driving `rowPinning`.
- Update `SortableColumns` description (menu-driven, uncontrolled default).
- `Default`, `ColumnSizing`, `ClientSidePagination`, `PrePaginated`, `LiveUpdates`,
  `Static` unchanged.

## Risks / Trade-offs
- [Consumers passing static `rowSelection` with no callback get a frozen selection]
  -> changeset migration note; `apps/next` visual scenarios switch to
  `defaultRowSelection`; the only in-repo caller is that visual test.
- [Handlers that resolve updaters keep compiling but their function branch is dead]
  -> called out in the changeset; behavior is benign (they receive resolved state).
- [Controlled `sort` without `onSortChange` freezes silently; TanStack and
  react-stately emit no warning] -> documented in prop JSDoc, same contract as
  every controlled prop in the package.
- [Controlled `rowPinning` can hold ids no longer in `data`; TanStack skips them at
  read time and never prunes] -> documented; the controlling owner prunes.
- [Rebase friction for `simplify-table-row-ordering` / `fix-table-column-order`]
  -> adapter is a new file; the `index.tsx` state block hunk is small and the
  landing order (density + this change first) is fixed in the brief.
- [Sort menu bypasses `column.toggleSorting`, so `sortDescFirst` / multi-sort
  options are not consulted] -> neither is exposed or used today; out of scope.

## Migration Plan
1. Land behind a `@accelint/design-toolkit` **major** changeset with:
   `rowSelection` -> `defaultRowSelection` for initial-only use;
   `onRowSelectionChange` now receives `RowSelectionState` (drop updater branches);
   `onSortChange` now receives `SortingState` in both modes (was
   `(columnId, direction)` in `manualSorting` only); new `sort` / `defaultSort` and
   pinning triples.
2. Update `apps/next` visual scenarios and `apps/docs` table page in the same PR.
3. Rollback: revert the PR; no persisted data or config is involved.

## Open Questions
No unresolved questions. Resolved at checkpoint 1: `onSortChange` is repurposed,
not deprecated (Decisions 5-6); the `getRowId` falsy-id fallback (`index.tsx:345-348`,
`id: 0` keyed by index) stays unchanged and out of scope for this change.
