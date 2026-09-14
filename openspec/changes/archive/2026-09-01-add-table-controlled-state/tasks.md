## 1. Adapter and controllable row selection [PKG:design-toolkit] [PKG:next]

Deliverable: `rowSelection` / `defaultRowSelection` / `onRowSelectionChange(RowSelectionState)` working end to end through the new private adapter, with tests, stories, and the `apps/next` visual scenarios migrated. This slice defines the adapter that slices 2 and 3 (and the sibling changes) reuse.

Test: `pnpm --filter @accelint/design-toolkit test -- table.test.tsx` passes with the new selection cases; `ControlledRowSelection` story's "Clear selection" button unchecks every row without a remount.

- [x] 1.1 [PKG:design-toolkit] Write failing tests in `packages/design-toolkit/src/components/table/table.test.tsx` (new `describe('Table row selection')`, local `setup()` helper, controlled wrapper as in `table-pagination.test.tsx:49-67`): controlled `rowSelection` prop change after mount unchecks `tanner`; `defaultRowSelection={{ tanner: true, joe: true }}` seeds checked rows; `onRowSelectionChange` spy receives a plain object `{ tanner: true, joe: true }` (assert `typeof` is `'object'`); unchecking `joe` yields `{ tanner: true }` with no `joe` key; select-all against `rowSelection={{ tanner: true }}` emits all three ids; controlled without callback stays `{ tanner: true }` after a click; `defaultRowSelection` ignored when `rowSelection` is set.
  Test: `pnpm --filter @accelint/design-toolkit test -- table.test.tsx` shows exactly these new cases failing (prop-after-mount and plain-object cases fail on `index.tsx:199-201` / `:320` behavior); pre-existing cases still pass.

- [x] 1.2 [PKG:design-toolkit] Create `packages/design-toolkit/src/components/table/use-table-controlled-state.ts` with `// __private-exports` as line 1 (before the license header), then `useTableControlledState<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void): [T, OnChangeFn<T>]` delegating to `useControlledState` from `react-stately/useControlledState`; JSDoc documents the triple convention (uncontrolled by default, controlled when `value !== undefined`, updaters resolved, plain value emitted, no mode switching) with an `@example`.
  Test: `pnpm --filter @accelint/design-toolkit exec tsc --noEmit -p tsconfig.dist.json` passes; `pnpm index` leaves `packages/design-toolkit/src/index.ts` unchanged (`git diff --stat packages/design-toolkit/src/index.ts` is empty).

- [x] 1.3 [PKG:design-toolkit] Wire the selection triple (depends on 1.2): in `types.ts` add `defaultRowSelection?: RowSelectionState`, re-document `rowSelection` as the controlled value, change `onRowSelectionChange` to `(rowSelection: RowSelectionState) => void` and drop the updater JSDoc example; in `index.tsx` destructure `rowSelection`, `defaultRowSelection = {}` (stable module-level `EMPTY_ROW_SELECTION` constant per `stepper/use-stepper-state.ts:217-228`), replace `useState` + `handleRowSelectionChange` with `useTableControlledState(rowSelection, defaultRowSelection, onRowSelectionChange)`, pass `onRowSelectionChange: setRowSelection`, delete `initialState.rowSelection`, update the `@param` JSDoc.
  Test: all cases from 1.1 pass; `table.test.tsx` "should move selected rows as a group" still passes; `git diff packages/design-toolkit/src/components/table/types.ts` shows no change inside the `TableContextValue` block.

- [x] 1.4 [PKG:design-toolkit] Stories in `table.stories.tsx`: change `InitialRowSelection` to `defaultRowSelection={{ tanner: true, joe: true }}` and render the last `onRowSelectionChange` payload as JSON (proving the plain-value shape); add `ControlledRowSelection` with external `useState`, a "Clear selection" button, and the selected ids list; fix the story description that says the callback receives an updater.
  Test: `pnpm --filter @accelint/design-toolkit storybook` renders both stories; clicking "Clear selection" unchecks all rows; the payload readout shows `{"tanner":true,"joe":true}` after toggling.

- [x] 1.5 [PKG:next] Switch `apps/next/src/features/table/variants.ts` (`with selected rows`, `all rows selected` scenarios) and `apps/next/src/features/table/table.visual.tsx:61-79` from `rowSelection` to `defaultRowSelection` (depends on 1.3).
  Test: `pnpm --filter next exec tsc --noEmit` passes; `pnpm --filter next visual -- table` (or the CI `visual-regression` job locally) shows no diff for the selection scenarios.

## 2. Sort triple and one write path for both modes [PKG:design-toolkit]

Deliverable: `sort` / `defaultSort` / `onSortChange(SortingState)` fed into the table engine as `state.sorting`, the header menu calling `handleSortChange` in both modes, and the arrow icon, menu `isDisabled` flags and `aria-sort` correct under `manualSorting`. Depends on slice 1 (uses the adapter from 1.2).

Test: `pnpm --filter @accelint/design-toolkit test -- table.test.tsx` passes the new sorting cases; `ServerSideSorting` story shows the down-arrow and `aria-sort="descending"` after choosing "Sort Descending".

- [x] 2.1 [PKG:design-toolkit] Write failing tests (new `describe('Table sorting')`, rows `tanner` 24 / `tandy` 40 / `joe` 45, open the header menu via `getByRole('button', { name: 'Menu' })` then `getByRole('menuitem', { name: 'Sort Descending' })`): client mode `onSortChange` spy receives `[{ id: 'age', desc: true }]`, then `[{ id: 'age', desc: false }]`, then `[]` for Clear Sort (assert array, not function); sorting `firstName` after `age` replaces the entry; `defaultSort={[{ id: 'age', desc: true }]}` renders `joe` first with `aria-sort="descending"`; controlled `sort` prop change from outside reorders rows and updates `aria-sort`; controlled without callback stays frozen; `manualSorting` + `sort={[{ id: 'age', desc: true }]}` keeps data order but sets `aria-sort` and enables "Clear Sort" / disables "Sort Descending"; unsorted column has "Clear Sort" disabled; clicking the header label text leaves `aria-sort` absent; `enableSorting={false}` + `enableColumnReordering` menu has no sort items.
  Test: the manual-mode `aria-sort`, disabled-state and `SortingState`-payload cases fail on current code (`header-cell.tsx:115-137`, `index.tsx:301-306`); client-mode ordering cases may pass already and stay green.

- [x] 2.2 [PKG:design-toolkit] Implement the triple (depends on 1.2, 2.1): `types.ts` adds `sort?: SortingState`, `defaultSort?: SortingState`, retypes `onSortChange?: (sort: SortingState) => void` (imports `SortingState` from `@tanstack/react-table`); `index.tsx` calls `useTableControlledState(sort, defaultSort ?? EMPTY_SORT, onSortChange)`, passes `sorting` into `state` and `onSortingChange: setSort`, and rewrites `handleSortChange` as `useCallback((columnId, dir) => setSort(dir ? [{ id: columnId, desc: dir === 'desc' }] : []), [setSort])` keeping its context signature; `header-cell.tsx` menu items call `handleSortChange?.(header.column.id, SortDirection.ASC | DESC | null)` unconditionally (delete the three `manualSorting ? ... :` ternaries at `:115-137`; keep `manualSorting` in context untouched).
  Test: all 2.1 cases pass; `git diff` of `types.ts` shows `TableContextValue` unchanged; `pnpm --filter @accelint/design-toolkit exec tsc --noEmit -p tsconfig.dev.json` passes.

- [x] 2.3 [PKG:design-toolkit] Stories: add `ControlledSorting` (`sort` / `onSortChange` with the state rendered as JSON), add `ServerSideSorting` (`manualSorting`, controlled `sort`, data sorted in the story's `useMemo` from `sort[0]`), and reword `SortableColumns` description to "use the column header menu (kebab) to sort ascending, descending, or clear sorting; uncontrolled by default".
  Test: Storybook renders all three; in `ServerSideSorting`, choosing "Sort Descending" on Age reorders rows and the header shows the down-arrow with `aria-sort="descending"` in the DOM inspector.

## 3. Controllable row pinning [PKG:design-toolkit]

Deliverable: `rowPinning` / `defaultRowPinning` / `onRowPinningChange(RowPinningState)` exposed through the same adapter, with the row kebab Pin/Unpin path unchanged, tests, and a `ControlledRowPinning` story. Depends on slice 1 (adapter from 1.2); independent of slice 2 apart from both editing the `index.tsx` state block.

Test: `pnpm --filter @accelint/design-toolkit test -- table.test.tsx` passes the new pinning cases; the `ControlledRowPinning` story's "Unpin all" button removes every `data-pinned` attribute.

- [x] 3.1 [PKG:design-toolkit] Write failing tests (new `describe('Table row pinning')`, `enableRowActions`, open row menus via `getByRole('button', { name: 'row 1 actions' })`): `defaultRowPinning={{ top: ['joe'], bottom: [] }}` renders `joe` as the first body row with `data-pinned="top"`; choosing "Pin" on `tanner` with `rowPinning={{ top: ['joe'], bottom: [] }}` calls the spy with `{ top: ['joe', 'tanner'], bottom: [] }` (plain object); "Unpin" on `joe` yields `{ top: ['tanner'], bottom: [] }`; controlled value set to `{ top: [], bottom: [] }` from outside clears all `data-pinned`; `{ top: ['ghost', 'joe'], bottom: [] }` renders `joe` pinned, no `ghost` row, and never calls the callback; controlled without callback stays unpinned after "Pin".
  Test: every case except the default-pinning render fails on current code (no props exist; `index.tsx:203-206` is plain `useState`); existing pinning-as-setup tests at `table.test.tsx:173-213` still pass.

- [x] 3.2 [PKG:design-toolkit] Implement (depends on 1.2, 3.1): `types.ts` adds `rowPinning?: RowPinningState`, `defaultRowPinning?: RowPinningState`, `onRowPinningChange?: (rowPinning: RowPinningState) => void` with JSDoc noting that ids absent from `data` are skipped, not pruned; `index.tsx` replaces the `useState` with `useTableControlledState(rowPinning, defaultRowPinning ?? EMPTY_ROW_PINNING, onRowPinningChange)` (module-level constant), keeps `state.rowPinning`, `onRowPinningChange: setRowPinning`, `enableRowPinning: true`, and leaves `RowActionsMenu`'s `row.pin(...)` untouched; update the `@param` JSDoc.
  Test: all 3.1 cases pass; `row-ordering-feature.ts` untouched (`git diff --stat` shows no change to it); `tsc --noEmit -p tsconfig.dev.json` passes.

- [x] 3.3 [PKG:design-toolkit] Story `ControlledRowPinning`: `defaultRowPinning` seed is replaced by `rowPinning` held in `useState({ top: ['joe'], bottom: [] })`, `onRowPinningChange={setPinning}`, an "Unpin all" button, and the pinning state rendered as JSON.
  Test: Storybook renders; pinning via the row kebab updates the JSON readout; "Unpin all" clears it and the pin icon disappears from the numeral cell.

## 4. Page reference test and documentation [PKG:design-toolkit] [PKG:docs]

Deliverable: the `page` slice covered as the reference implementation, and every Table doc surface (JSDoc, `table.docs.mdx`, `apps/docs` table page) describing the new triples, the plain-value callbacks, and menu-driven sorting. 4.1 is independent; 4.2-4.4 depend on the final prop names from slices 1-3.

Test: `pnpm --filter @accelint/design-toolkit test -- table-pagination.test.tsx` passes; `grep -rn "(columnId" packages/design-toolkit/src/components/table apps/docs/content/docs/toolkits/design-toolkit/components/table.mdx` returns nothing.

- [x] 4.1 [PKG:design-toolkit] Add to `table-pagination.test.tsx`: `defaultPage={2}` with `pageSize={10}` renders `first-11` .. `first-20` and not `first-1` (uncontrolled); controlled `page={1}` with a spy `onPageChange` receives `2` after clicking "Next page" (plain number). No source change expected.
  Test: both cases pass without touching `index.tsx:208-230`; whole file green.

- [x] 4.2 [PKG:design-toolkit] Update `table.docs.mdx`: props table rows for `rowSelection` (controlled), `defaultRowSelection`, `onRowSelectionChange(RowSelectionState)`, `rowPinning` / `defaultRowPinning` / `onRowPinningChange`, `sort` / `defaultSort` / `onSortChange(SortingState)`; rewrite the selection snippet (`:84-96`) and add server-side sorting and pinning snippets; replace "Keyboard navigation for sorting" wording with the header-menu description; state that `SortingState` / `RowSelectionState` / `RowPinningState` are imported from `@tanstack/react-table`.
  Test: Storybook Docs tab renders the MDX without errors; `grep -n "updater" packages/design-toolkit/src/components/table/table.docs.mdx` returns nothing.

- [x] 4.3 [PKG:docs] Update `apps/docs/content/docs/toolkits/design-toolkit/components/table.mdx` (existing page; no new file): the type block (`:38-53`), the props table, the `rowSelection` / `manualSorting` / `onSortChange` prop sections, the selection example (`:210-215`), and rewrite the "Server-side sorting" example (`:253-283`) to hold `SortingState` and read `sort[0]?.id` / `sort[0]?.desc`; replace "Click column headers to sort" with the header-menu wording.
  Test: `pnpm --filter docs build` (or `pnpm --filter docs lint`) passes; `grep -n "updaterOrValue\|columnId: string" apps/docs/content/docs/toolkits/design-toolkit/components/table.mdx` returns nothing.

- [x] 4.4 [PKG:design-toolkit] JSDoc on `Table` (`index.tsx` `@param props.*` block) and on the new hook: every new prop documented, `rowSelection` no longer described as "Initial", `onSortChange` example shows a `SortingState` handler, controlled-without-callback freeze noted once per slice.
  Test: `pnpm run audit:docblocks` reports no new findings for `components/table/`.

## 5. Verification gate and changeset [PKG:design-toolkit]

Deliverable: the full gate green across the monorepo, public export surface proven unchanged, and a major changeset for `@accelint/design-toolkit` documenting the three breaking items with migration steps. Depends on slices 1-4.

Test: `pnpm run build && pnpm run test && pnpm run lint && pnpm run format` all exit 0; `.changeset/` contains one new file with `'@accelint/design-toolkit': major`.

- [x] 5.1 [PKG:design-toolkit] Run the verification gate in order: `pnpm run build`, `pnpm run test`, `pnpm run lint`, `pnpm run format`; fix any failure at its cause (never `--no-verify`). Also run `pnpm run lint:rac` to confirm `react-stately` still resolves to a single version.
  Test: each command exits 0; `git status` shows only the files listed in proposal.md Impact plus the changeset.

- [x] 5.2 [PKG:design-toolkit] Prove the export surface: `pnpm index` then `git diff --stat packages/design-toolkit/src/index.ts` is empty (the adapter stays private); `git diff packages/design-toolkit/src/components/table/types.ts` shows no edits inside `TableContextValue` or `TableHeaderProps`; no `package.json` dependency changes (`git diff --stat -- '**/package.json'` is empty).
  Test: all three checks come back empty; a scratch consumer file importing `SortingState` from `@accelint/design-toolkit` fails to type-check (confirming D8) and is deleted afterwards.

- [x] 5.3 [PKG:design-toolkit] Create the changeset with `pnpm changeset` (`@accelint/design-toolkit`: major). Body: a `BREAKING CHANGES:` heading (matching the `10.0.0` CHANGELOG entry style) listing (1) `rowSelection` is now controlled, use `defaultRowSelection` for initial-only selection; (2) `onRowSelectionChange` receives a plain `RowSelectionState`, remove `typeof updater === 'function'` branches; (3) `onSortChange` receives `SortingState` in both modes, read `sort[0]?.id` / `sort[0]?.desc` instead of `(columnId, direction)`; then an additive list (`defaultRowSelection`, `rowPinning`, `defaultRowPinning`, `onRowPinningChange`, `sort`, `defaultSort`) and the note that state types come from `@tanstack/react-table`. No changeset for `apps/next` or `apps/docs`.
  Test: `pnpm changeset status` lists `@accelint/design-toolkit` with a major bump and no other package; the file has no em dashes and no credential-looking strings.

## Parallelization Strategy

### Independent slices (can run concurrently)

- Slice 1 is the root: task 1.2 creates the adapter that 2.2 and 3.2 import, and 1.3 rewrites the `index.tsx` state block that 2.2 and 3.2 extend.
- After 1.2 and 1.3 land, slices 2 and 3 are logically independent (different props, different tests, different stories) and can be implemented concurrently. Both edit the same `index.tsx` state block and `types.ts` `ExtendedTableProps`, so run them in separate worktrees and rebase the second onto the first; the hunks are small and non-overlapping in intent.
- Task 4.1 (`defaultPage` test) touches only `table-pagination.test.tsx` and can run at any time, including in parallel with slice 1.
- Task 1.5 (`apps/next`) and tasks 4.2-4.4 (docs) can run in parallel with each other once the prop names they document exist.

### Sequential slices and why

- 1.1 -> 1.2 -> 1.3 -> 1.4 / 1.5: TDD order; the adapter must exist before wiring; stories and `apps/next` need the final prop names.
- Slice 2 and slice 3 each follow failing-test -> implementation -> story order internally, and both wait on 1.2 / 1.3.
- 4.2-4.4 wait on slices 1-3 so the docs describe the shipped API rather than the design.
- Slice 5 is last: the gate must run against the complete change, and the changeset text lists every breaking item from slices 1 and 2.

### Recommended order

1. Slice 1 (1.1 -> 1.2 -> 1.3, then 1.4 and 1.5 together); 4.1 alongside.
2. Slices 2 and 3 concurrently in separate worktrees; rebase the later one.
3. Slice 4 docs (4.2, 4.3, 4.4) concurrently.
4. Slice 5.

### Cross-change landing order

`add-table-density-variant` and `add-table-controlled-state` land first (independent of each other); then `simplify-table-row-ordering` and `fix-table-column-order` are rebased on them and adopt the `useTableControlledState` adapter for `rowOrdering` and `columnOrder`.
