# Tasks

All paths are under `packages/design-toolkit/src/components/table/` unless stated. Do not edit the uncommitted `hiddenKebabMenuIds` hunks in `context.tsx`, `header.tsx`, `header-cell.tsx`, `index.tsx`, `types.ts` or `table.stories.tsx`; add new code beside them.

Open Questions 1-3 in `design.md` are not resolved. These tasks build the "all options of the 7 registered features" default (Decision 1) and keep the Decision 5 raw `onColumnSizingChange` passthrough. If the requester names a smaller option set, only 1.1-1.3 change (allowlist instead of `Omit`).

## 1. Option passthrough end to end (types, key map, wiring)

Dependencies: none. Deliverable: `<Table defaultColumn={{ size: 200 }} data-testid="tracks" />` type-checks, the option reaches `useTable`, no engine option reaches `<table>`, owned keys are rejected by the type, and a TanStack key drift fails `tsc`.

- [x] 1.1 [PKG:design-toolkit] Type spike: add `EngineOptions<T> = Omit<TableOptions<TableFeatures, T>, OwnedKey | DebugKey>` in `types.ts` and `expectTypeOf` assertions in `src/lib/types.test-d.ts` that optionality, callback signatures, `getRowId`/`enableRowSelection` row typing through `Table<T extends { id: Key }>`, and the merged `onRowOrderingChange` survive `Omit`. Test: `pnpm tsc --noEmit -p tsconfig.dev.json` shows no new errors in the assertions. If `Omit` collapses or widens any key, switch to the `Pick`/allowlist fallback from Decision 1 before continuing, and note it in `design.md`.
- [x] 1.2 [PKG:design-toolkit] Split `ExtendedTableProps<T>` into `OwnProps<T>` (current literal, unchanged) `& Omit<EngineOptions<T>, keyof OwnProps<T>>`, with JSDoc on the new surface (`onColumnSizingChange` receives TanStack updaters; `getSubRows` does not render a tree; `pageCount`/`rowCount`/`autoResetPageIndex` only matter with `pageSize`; `meta` is weakly typed). Test: in `types.test-d.ts`, `onSortingChange` and `enableFilters` are errors on the data branch, `defaultColumn` and `initialState` are accepted, `onSortChange` is still on `ExtendedTableProps`, and every engine key is `undefined` in the `children` branch (same pattern as `variant`); the existing `Extract`/`Exclude` assertions on `TableProps<Track>` still pass.
- [x] 1.3 [PKG:design-toolkit] Create private `engine-option-keys.ts` (first line `// __private-exports`, license header, kebab-case) exporting `ENGINE_OPTION_KEYS: Record<keyof EngineOptions<RowData>, true>` and `splitEngineOptions(rest)` returning `{ engine, dom }` in one pass. Add a compile-time check that `keyof EngineOptions` and `keyof ComponentPropsWithRef<'table'>` are disjoint. Test: `pnpm tsc --noEmit -p tsconfig.dist.json` passes; temporarily deleting one key from the map and temporarily adding a bogus key each produce a `tsc` error (revert both); `pnpm index` leaves `src/index.ts` unchanged.
- [x] 1.4 [PKG:design-toolkit] Wire the split into `index.tsx` (depends on 1.2 and 1.3): call `splitEngineOptions(rest)`, spread `dom` onto `<table>`, and build the `useTable` options as `{ enableRowSelection: true, enableRowPinning: true, getRowId: <existing default>, ...engine, features, data, columns, enableSorting, manualSorting, manualPagination, state, <owned on*Change handlers> }`. Do not memoize `engine` or the merged object (Decision 6). Test: in `table.test.tsx`, a Table with `defaultColumn={{ size: 200 }}`, `getRowId`, `meta`, `enableSortingRemoval`, `initialState` and `data-testid="tracks"` renders a column without `size` at 200px and a `<table>` with `data-testid="tracks"` and no attribute named after an engine option; a Table with `aria-label="Tracks"` and `id="track-table"` still forwards both; the existing table test suite still passes.
- [x] 1.5 [PKG:design-toolkit] Re-measure `pnpm tsc --noEmit -p tsconfig.dist.json --extendedDiagnostics` against the baseline (111,421 types, 507,450 instantiations, 2.20s check) (depends on 1.2 and 1.3). Test: record the new numbers in the PR description; if instantiations grow materially, stop and revert to the allowlist fallback.

## 2. Owned values always win

Dependencies: Slice 1 (1.4). Deliverable: consumer `initialState` and cast or JS-supplied owned options cannot override the Table's controlled slices or handlers, while unowned slices such as `columnSizing` can be seeded.

- [ ] 2.1 [PKG:design-toolkit] Strip owned slices (`rowSelection`, `rowPinning`, `rowOrdering`, `sorting`, `columnOrder`, `pagination`) from a consumer `initialState` before passing it to `useTable`; keep `columnSizing` and other unowned slices. Test: with `initialState={{ sorting: [{ id: 'age', desc: true }] }}` cast through, the rendered sort is the `sort`/`defaultSort` value (default `[]`) and `aria-sort` is unset; with `initialState={{ columnSizing: { callsign: 240 } }}` the `callsign` header and cells are 240px wide.
- [ ] 2.2 [PKG:design-toolkit] Cover owned-option precedence for JS/type-cast consumers. Test: a cast `onSortingChange`, `manualPagination` or `state` prop does not replace the Table's handlers or controlled state (sorting via the header menu still calls `onSortChange` with a plain `SortingState`), and none of those names reaches `<table>`.

## 3. Behavior of accepted options

Dependencies: Slice 1 (1.4); independent of Slice 2. Deliverable: the user-visible scenarios in `specs/table-option-passthrough/spec.md` hold.

- [ ] 3.1 [PKG:design-toolkit] Verify `defaultColumn` and meta-column width. Test: with `defaultColumn={{ size: 300 }}` and `showCheckbox`, the selection column is 32px and consumer columns without `size` are 300px; with `defaultColumn={{ size: 200 }}` and `meta={{ locale: 'en-US' }}` a column without `size` is 200px and neither prop appears on `<table>`. Fix the column definitions in `index.tsx` only if the numeral/selection/kebab columns do not already set `size: 32`.
- [ ] 3.2 [PKG:design-toolkit] Verify `enableRowSelection`/`enableRowPinning` overrides and defaults. Test: with `enableRowSelection={(row) => row.original.affiliation !== 'hostile'}` and `showCheckbox`, the hostile row's checkbox is disabled (keeping its accessible name) and the others are enabled; with neither prop set, selecting and pinning a row still work; selection and pinning controlled/uncontrolled behavior is unchanged.
- [ ] 3.3 [PKG:design-toolkit] Verify `getRowId` override and sort-contract preservation. Test: rows `{ id: 1, callsign: 'VIPER' }` and `{ id: 2, callsign: 'COBRA' }` with `getRowId={(row) => row.callsign}` give selection state `{ VIPER: true }` after selecting the first row; with `enableMultiSort` and `age` sorted ascending, choosing "Sort Descending" on `name` calls `onSortChange` with `[{ id: 'name', desc: true }]`.
- [ ] 3.4 [PKG:design-toolkit] Verify pagination interaction. Test in `table-pagination.test.tsx`: with `pageSize` unset and consumer `pageCount`/`rowCount`/`autoResetPageIndex` supplied, all rows still render (pass-through behavior unchanged); with `pageSize` set, `pageCount` clamps navigation without breaking `page`/`onPageChange` sync.

## 4. Storybook and documentation

Dependencies: Slices 2 and 3 (stories and docs describe verified behavior). Deliverable: the feature is demonstrable and documented.

- [ ] 4.1 [PKG:design-toolkit] Add an `OptionPassthrough` story to `table.stories.tsx` (outside the WIP `hiddenKebabMenuIds` hunks) using `defaultColumn.size`, `initialState.columnSizing`, a predicate `enableRowSelection`, and a custom `getRowId`; add argTypes for the new options only where needed. Test: `pnpm tsc --noEmit -p tsconfig.dev.json` has no new errors from the story, and the story renders in Storybook with the seeded widths and the disabled checkbox.
- [ ] 4.2 [PKG:design-toolkit] Update `table.docs.mdx` (Props table) and `apps/docs/content/docs/toolkits/design-toolkit/components/table.mdx` (its `interface TableProps`) through the `accelint-api-docs` skill, listing accepted options, owned options, the updater semantics of `onColumnSizingChange`, the `getSubRows` and `meta` caveats, and that TanStack types are imported from `@tanstack/react-table`. Check `apps/docs/.index.json` before creating or moving files. Test: the documented owned-key list matches `OwnedKey` in `types.ts`, and the docs build or lint step for `apps/docs` passes.

## 5. Verification gate and changeset

Dependencies: Slices 1-4.

- [ ] 5.1 [PKG:design-toolkit] Create a changeset with `pnpm changeset`: `@accelint/design-toolkit` minor, noting the new accepted option names and that a prop name previously forwarded to `<table>` is now consumed as an option. Test: `.changeset/` contains one new markdown file naming `@accelint/design-toolkit` with a minor bump.
- [ ] 5.2 [PKG:design-toolkit] Run the gate in order from the repo root and in `packages/design-toolkit`: `pnpm run build`, `pnpm tsc --noEmit -p tsconfig.dist.json`, `pnpm run test`, `pnpm run lint`, `pnpm run format`, plus `pnpm run format:check`, `pnpm run lint:fs` and `pnpm index` if files were added. Test: every command exits 0 (test-file-only type errors under `tsconfig.dev.json` are noted, not blocking); report the `tsc` metrics from 1.5, whether format regenerated tracked files, and that `git diff` shows the `hiddenKebabMenuIds` hunks untouched.

## Parallelization Strategy

### Dependencies (Must Complete First)

- **Slices 2 and 3** must wait for Slice 1 (1.4): they exercise the runtime wiring in `index.tsx`.
- **Slice 4** must wait for Slices 2 and 3: stories and docs describe verified behavior.
- **Slice 5** must wait for Slices 1-4: it runs the gate over the finished change.

**Independent tasks (can run in parallel):**
- Slice 2 and Slice 3 are independent once Slice 1 is done → can implement simultaneously. Coordinate on `index.tsx`: only 2.1 edits it (the `initialState` strip); the rest are tests.
- 3.1, 3.2, 3.3 and 3.4 cover different scenarios (3.4 is a separate file, `table-pagination.test.tsx`) → can run simultaneously.
- 4.1 (story) and 4.2 (docs) are independent → can run simultaneously.
- 4.2 can be drafted after 1.2 fixes the public type and JSDoc, but must be checked against Slices 2 and 3 before it is final.

**Sequential dependencies:**
- 1.1 → 1.2 → 1.3 → 1.4 → 1.5: the spike decides whether `Omit` or the allowlist fallback applies, 1.4 needs both the type and the key map, and 1.5 measures the result.
- 2.1 → 2.2: both edit or test the same `useTable` call.

**Critical path:**
Slice 1 → Slice 2 or 3 → Slice 4 → Slice 5. Slice 1 shares `types.ts` and `index.tsx` with the uncommitted `hiddenKebabMenuIds` work, so it should not be split across concurrent agents.

**Recommended implementation order:**
1. Slice 1 serially, stopping after 1.1 if the spike fails.
2. Slices 2 and 3 in parallel.
3. 4.1 and 4.2 in parallel.
4. Slice 5.

## Workflow follow-up

- Get requester answers to Open Questions 1-3 in `design.md` before merge (option set, `columnSizing` promotion, minor semver for the DOM-prop change).
- Archive the change with `accelint-qrspi-archive` after review requirements are satisfied.
