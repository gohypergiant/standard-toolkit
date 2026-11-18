---
change: table-option-passthrough
created_at: "2026-11-04T23:52:56Z"
started_at: "2026-11-05T16:05:30Z"
specs_touched: [table-option-passthrough]
decisions:
  - id: D1
    choice: Derive the accepted type from TanStack TableOptions minus an owned-key list, with keyof OwnProps removed from the engine side
    rationale: The list tracks TanStack automatically, and removing keyof OwnProps avoids never or conflicting callback types where a Table prop shares a name with a TanStack key
    alternatives: [hand-written allowlist, Pick from TanStack]
  - id: D2
    choice: Exclude debugAll and the debug* template-literal keys
    rationale: They are not feature options and are template-literal derived, so omitting them keeps the key map small and the type cheaper
    alternatives: [accept debug options]
  - id: D3
    choice: Private exhaustive Record<key, true> engine option key map plus splitEngineOptions
    rationale: A missing or extra key becomes a tsc error, so TanStack drift fails the type gate instead of leaking onto the table element
    alternatives: [denylist of DOM attributes, runtime Object.keys of TanStack defaults]
  - id: D4
    choice: Spread engine options before owned values; strip owned slices from consumer initialState; do not accept state
    rationale: useTable merges shallowly and table_reset writes initialState back into base atoms, so owned values must win and owned slices must not leak through initialState
    alternatives: [deep-merge a consumer state]
  - id: D5
    choice: Pass onColumnSizingChange through with TanStack updater semantics; plain-value rule stays scoped to Table-owned slices
    rationale: Resolving updaters needs current state, which the Table does not hold for unowned slices; promoting columnSizing to an owned triple is a separate public-API change
    alternatives: [omit onColumnSizingChange and columnSizing]
  - id: D6
    choice: Do not memoize the split result or merged options
    rationale: useTable re-applies options every render and no memoized child receives the options object, so memoizing would never hit
    alternatives: [useMemo on engine]
  - id: D7
    choice: One new capability with no delta to existing table specs; minor changeset for design-toolkit; docs via accelint-api-docs
    rationale: The behavior is additive and uncovered by existing requirements, and it avoids conflicting with the in-flight fix-table-column-order change
    alternatives: [modify table-state-management]
---

# Design

## Current State

All paths are under `packages/design-toolkit/src/components/table/`.

- `index.tsx` destructures the Table's own props, spreads the remainder (`...rest`) onto `<table>` (L488, L515), and calls `useTable({...})` at L417. That call sets `features`, `data`, `columns`, `enableSorting`, `state` (`rowSelection`, `rowPinning`, `rowOrdering`, `sorting`, `columnOrder`, plus `pagination` only when `pageSize` is set), `getRowId`, `enableRowSelection: true`, `enableRowPinning: true`, `manualSorting`, `manualPagination: pagination == null` and five `on*Change` adapters.
- `types.ts` defines `TableProps<T>` as `BaseTableProps & (ExtendedTableProps<T> & {children?: never} | PropsWithChildren<{[K in keyof ExtendedTableProps<T>]?: never}>)`. `variant` is the precedent for a new key being forbidden in the children branch (asserted in `src/lib/types.test-d.ts`).
- `features.ts` registers sorting, row selection, row pinning, pagination, column ordering, column sizing and the custom `rowOrderingFeature`. `rowExpandingFeature` is not registered. No `tableMeta` or `columnMeta` slot is declared.
- The `table` instance is not exposed. Only `getHeaderGroups` and the top/center/bottom row getters are read.
- The Table already declares props whose names equal TanStack keys but with different types: `enableSorting`, `manualSorting`, `onRowSelectionChange`, `onRowPinningChange`, `onColumnOrderChange` (plain values, not updaters). It also owns the `sort`/`page` triples.
- Uncommitted WIP on this branch adds `hiddenKebabMenuIds` (destructured, so it never reaches `<table>`). This change must not edit those hunks.

Today every non-destructured prop, valid or not, reaches `<table>`.

## Desired End State

- Consumers can pass the TanStack options of the 7 registered features. Owned options are not accepted (type level) and cannot be overridden (runtime).
- Engine options are separated from DOM props before render, so none reach `<table>`.
- Behavior of every Table-owned slice, the single-entry sort contract, density and meta-column width is unchanged. See `specs/table-option-passthrough/spec.md`.

```
 props ──► destructure Table-owned props (existing)
              │
              ▼ rest
        splitEngineOptions(rest)      key lookup in ENGINE_OPTION_KEYS
         ├── engine ──► merge ──► useTable({ defaults, ...engine, ...owned })
         └── dom    ──────────────► <table {...dom}>
```

## Patterns to Follow

- `use-table-controlled-state.ts` is the reference for private, non-exported helpers. The new key map file starts with `// __private-exports` so the generated barrel skips it.
- `variant` plumbing and its `types.test-d.ts` assertions are the template for the children-branch tests.
- `ColumnSizing` and `ControlledColumnOrder` stories are the template for the new story.

## Patterns to Avoid

- Re-exporting TanStack types from `@accelint/design-toolkit` (`table-state-management` requires consumers import them from the peer).
- Hand-editing the generated `src/index.ts` barrel.
- Wrapping consumer options in `useMemo`. `useTable` re-applies options every render already, and the Table does not pass them to memoized children. See Decision 6.

## Goals / Non-Goals

**Goals:**
- A compile-time-complete list of accepted options derived from TanStack's types, so TanStack additions are not silently lost.
- Zero engine options on `<table>`.

**Non-Goals:**
- Exposing the `table` instance, a ref, or a render prop.
- Changing the plain-value callback rule for owned slices.
- Making `getSubRows` render a tree (see Risks).

## Decisions

### Decision 1: Derive the accepted type from `TableOptions`, minus an owned list

**Choice:** `EngineOptions<T> = Omit<TableOptions<TableFeatures, T>, OwnedKey | DebugKey>`. `ExtendedTableProps<T>` becomes `OwnProps<T> & Omit<EngineOptions<T>, keyof OwnProps<T>>`, where `OwnProps` is the current object literal. `OwnedKey` is `features | data | columns | state | atoms | mergeOptions | key | manualPagination | onSortingChange | onRowSelectionChange | onRowPinningChange | onRowOrderingChange | onColumnOrderChange | onPaginationChange`. `enableSorting` and `manualSorting` stay as the Table's own props and are removed from the engine side via `keyof OwnProps`.

**Rationale:** The list tracks TanStack automatically, so options added in a minor release type-check for consumers without edits. Removing `keyof OwnProps` avoids the intersection producing `never` or a conflicting callback type where the Table's plain-value prop shares a name with an updater-based TanStack key.

**Alternatives Considered:**
- Hand-written allowlist of options: stable, but needs an edit per request and diverges from TanStack. Rejected as the default; revisit if the requester names a small required set (Open Question 1).
- `Pick` from TanStack: same drift, no benefit.

### Decision 2: Debug options are excluded

**Choice:** `debugAll` and the `debug*` template-literal keys are omitted from the type and the key map.

**Rationale:** They are not feature options, they are template-literal derived, and a consumer enabling them can use TanStack tooling elsewhere. Keeping them out keeps the key map small and the type cheaper.

**Alternatives Considered:** Accepting them: harmless, but adds keys that the exhaustive map must enumerate.

### Decision 3: Exhaustive runtime key map, typed against the option type

**Choice:** A private file `engine-option-keys.ts` exports `ENGINE_OPTION_KEYS: Record<keyof EngineOptions<RowData>, true>` and a small `splitEngineOptions(rest)` that returns `{ engine, dom }` by one pass over `Object.keys(rest)`.

**Rationale:** `Record<K, true>` makes a missing or extra key a `tsc` error, so drift from a TanStack bump fails `pnpm tsc --noEmit -p tsconfig.dist.json` (the existing CI type gate) instead of leaking onto `<table>` silently. The renovate/dependency PR author is the one who reacts. Cost is O(props) per render, a handful of keys.

**Alternatives Considered:**
- Denylist of DOM attributes (everything else is an option): the DOM attribute set is open (`data-*`, `aria-*`), so unknown keys would be swallowed. Rejected.
- Runtime `Object.keys(tableOptionsDefaults)`: TanStack exposes no enumerable key list.

### Decision 4: Merge order and `initialState` handling

**Choice:** `useTable({ enableRowSelection: true, enableRowPinning: true, getRowId: defaultGetRowId, ...engine, features, data, columns, enableSorting, manualSorting, manualPagination, state, on*Change handlers })`. Consumer `initialState` is passed through with the owned slices removed (`rowSelection`, `rowPinning`, `rowOrdering`, `sorting`, `columnOrder`, `pagination`). `columnSizing` and any other unowned slice remain.

**Rationale:** `useTable` merges shallowly, so a consumer `state` would replace the Table's whole `state`; `state` is therefore not accepted. State precedence is `atoms > state > baseAtoms`, so owned slices already win over `initialState`, but `table_reset` writes `initialState` back into the base atoms. Stripping owned slices keeps reset and the `x/defaultX` contract consistent. Putting engine options before owned ones guarantees owned values win even for a JS or type-cast consumer.

**Alternatives Considered:** Deep-merging a consumer `state`: lets consumers fight the controlled adapters. Rejected.

### Decision 5: Callbacks for unowned slices are TanStack-shaped

**Choice:** `onColumnSizingChange` is accepted as typed by TanStack and receives an updater (`OnChangeFn`). The `table-state-management` rule (plain values) is scoped to Table-owned slices and is not modified. The prop JSDoc states that this callback receives TanStack updaters.

**Rationale:** Resolving updaters needs the current state, which the Table does not hold for unowned slices. Promoting `columnSizing` to a Table-owned triple is a separate public-API change.

**Alternatives Considered:** Omit `onColumnSizingChange` and `columnSizing` now: removes the only way to observe resizing. Deferred to the requester (Open Question 2).

### Decision 6: No memoization of consumer options

**Choice:** Do not memoize the split result or the merged options object.

**Rationale:** `useTable` re-applies options on every render and `table` is a new object each render (see the comment above `moveColumn` in `index.tsx`). No memoized child receives the options object. `.agents/react.md` targets objects passed to `React.memo` children or used as dependencies; neither applies. Inline `defaultColumn`/`meta` from consumers therefore add no re-renders beyond the Table's own.

**Alternatives Considered:** `useMemo` on `engine`: its dependency (`rest`) is new each render, so it would never hit.

### Decision 7: Spec capability, semver, and process

**Choice:** One new capability `table-option-passthrough`. No delta to `table-state-management`, `table-sorting` or `table-density`; this also avoids a conflict with the in-flight `fix-table-column-order` change, which modifies `table-state-management`. Changeset: `@accelint/design-toolkit` minor. Docs: update `table.docs.mdx` and `apps/docs/.../components/table.mdx` through `accelint-api-docs`.

**Rationale:** The new behavior is additive and is not covered by an existing requirement; the existing specs stay true for owned slices.

**Alternatives Considered:** Modify `table-state-management`: only needed if unowned-slice callbacks were wrapped (rejected in Decision 5).

## Accessibility

No new UI. Selection and pinning remain react-aria controlled; a consumer `enableRowSelection` predicate only changes whether a row's checkbox is disabled, which must keep the accessible name and the disabled semantics of the existing checkbox. Keyboard behavior, header-menu focus handling, and `aria-sort` follow the sort state and are untouched. Because `enableMultiSort` is accepted but header actions write a single entry, `aria-sort` can never show more than one sorted column (spec: "Existing sort behavior is preserved").

## Storybook

- New `OptionPassthrough` story: `defaultColumn.size`, `initialState.columnSizing`, a predicate `enableRowSelection`, and a custom `getRowId`.
- Existing `ColumnSizing` story stays as is. Existing stories are only touched where argTypes need the new options (outside the WIP `hiddenKebabMenuIds` hunks).

## Verification Approach

- `types.test-d.ts`: owned keys are errors; children branch types every engine key as `undefined`; `Extract`/`Exclude` on `TableProps<Track>` still resolve; `ExtendedTableProps` keeps `onSortChange`.
- `table.test.tsx`: engine options absent from `<table>`; `data-testid`/`aria-*` still present; `defaultColumn` and meta-column widths; `enableRowSelection` predicate; owned `initialState` slices ignored; `columnSizing` seeded.
- A test that `ENGINE_OPTION_KEYS` and `splitEngineOptions` agree is not needed at runtime: the `Record` type is the check, exercised by `tsc`.
- Gate: `pnpm run build`, `pnpm tsc --noEmit -p tsconfig.dist.json` (re-measure types/instantiations against the 111,421 / 507,450 baseline), `pnpm run test`, `pnpm run lint`, `pnpm run format`, plus `pnpm index` if the barrel changes.

## Risks / Trade-offs

- **`Omit` over invariant TanStack generics is unverified** (`in out`, merged `onRowOrderingChange`). It may collapse optionality or widen callbacks. → First task is a type spike with `expectTypeOf` assertions; fall back to `Pick` or an allowlist (Decision 1) if it misbehaves.
- **`tsc` cost of the large intersection is unmeasured.** → Re-measure with `--extendedDiagnostics`; abort Decision 1 for an allowlist if instantiations grow materially.
- **`meta` is weakly typed** (empty global `TableMeta`, no `tableMeta` slot), and a consumer reads it only inside column renderers via `table.options.meta`. → Document; do not add a `tableMeta` slot in this change.
- **`getSubRows` is accepted but not rendered as a tree.** It affects `row.subRows`, the third `getRowId` argument and sub-row selection only. → JSDoc states hierarchical rendering is unsupported; consider omitting `getSubRows` if the requester does not need it.
- **Consumer `pageCount`/`rowCount`/`autoResetPageIndex`** interact with the Table's pagination adapter. `manualPagination` stays Table-owned, but `pageCount` clamps `setPageIndex`. → Test that with `pageSize` unset the pass-through behavior is unchanged; document that these only matter when `pageSize` is set.
- **DOM-prop behavior change.** A prop previously forwarded to `<table>` is now consumed. By inspection no `<table>` attribute shares a name with a TanStack key, but the full `HTMLAttributes` set was not type-checked. → The implementation includes a compile-time disjointness check between `keyof EngineOptions` and `keyof ComponentPropsWithRef<'table'>`.
- **Unregistered-feature options fail only at compile time.** A JS consumer's `enableFilters` goes to `<table>` and React warns about an unknown prop. → Accepted; matches today's behavior for unknown props.
- **`TableProps` widening** can break consumers that intersect it with a conflicting prop type. → Minor changeset notes the new names.

## Migration Plan

None required for consumers. Rollback is reverting the change; no data or persisted state is involved. The changeset is minor (additive).

## Open Questions

1. Which options do consumers actually need (ticket or example)? The design assumes "all options of the 7 registered features". A smaller required set would switch Decision 1 to an allowlist and shrink the spec. Requester input needed.
2. Should `columnSizing`/`onColumnSizingChange` be promoted to a Table-owned triple instead of Decision 5's raw passthrough? Requester input needed.
3. Is minor acceptable for the DOM-prop change, given `TableProps` is a public export with 13 direct dependents? Requester input needed before merge.
