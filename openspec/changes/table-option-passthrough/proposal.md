# Proposal

## Why

The design-toolkit `Table` builds a TanStack Table v9 instance internally and exposes none of its configuration. It hardcodes `getRowId`, `enableRowSelection: true`, `enableRowPinning: true` and `manualSorting`. It derives `manualPagination` and `enableSorting` from its own props. Consumers cannot set `meta`, `defaultColumn`, `getSubRows`, `enableMultiSort`, `enableSortingRemoval`, `sortDescFirst`, `autoResetPageIndex`, `pageCount`/`rowCount`, `initialState` (for unowned slices such as `columnSizing`) or the other engine options. The `table` instance is not exposed either (no ref, no render prop), so options are the only extension path.

The requester has not yet named the options consumers need or the success criteria (see Open Questions in `design.md`). This proposal therefore scopes the work to a broad, type-driven passthrough of the options of the 7 registered features, with the Table staying authoritative over the slices and options it owns.

## What Changes

- `Table` (data-driven branch only) accepts the TanStack `TableOptions` for its registered features (sorting, row selection, row pinning, pagination, row ordering, column ordering, column sizing) in addition to its current props.
- Options the Table owns or derives are excluded from the accepted type and are never overridden by a consumer value: `features`, `data`, `columns`, `state`, `atoms`, `mergeOptions`, `key`, `manualSorting`, `manualPagination`, and the `on*Change` handlers for owned slices (selection, sorting, pinning, row ordering, column order, pagination).
- `enableRowSelection` and `enableRowPinning` become overridable defaults (default `true`, as today). `getRowId` keeps the Table's `id`-or-index default and may be overridden.
- A private runtime key map splits incoming props into engine options and DOM props, so no engine option reaches `<table>` via `...rest`. `data-*`/`aria-*` and every other prop continue to reach `<table>`.
- The static `children` branch rejects every new option as `never`, the same mechanism as `variant`.
- New unit, type and story coverage; Storybook and docs Props tables updated.
- No new dependency and no change to Table-owned controlled/uncontrolled triples.

## Capabilities

### New Capabilities
- `table-option-passthrough`: which TanStack options the data-driven `Table` accepts, which it owns and ignores, how consumer options merge with Table defaults, and the guarantee that engine options never reach the `<table>` element.

### Modified Capabilities
<!-- None. The existing table-state-management, table-sorting and table-density
     requirements are unchanged; they continue to govern Table-owned slices only.
     The in-flight fix-table-column-order change already modifies
     table-state-management, so this change avoids touching that spec. -->

## Impact

- Package: `@accelint/design-toolkit` only. Files under `packages/design-toolkit/src/components/table/`: `types.ts`, `index.tsx`, a new private option-key map file, tests, and `table.stories.tsx`.
- Docs: `table.docs.mdx` (Storybook Props table) and `apps/docs/content/docs/toolkits/design-toolkit/components/table.mdx` (own `interface TableProps`). Use `accelint-api-docs`.
- Downstream: `TableProps` is a public export with 13 direct dependents (stories, `table.test.tsx`, generated re-exports, `ChildrenTableProps`, `DataTableProps`) and 65 transitive. Widening `TableProps` can break consumers that extend or intersect it.
- Semver: expected **minor** changeset for `@accelint/design-toolkit` (additive props). One behavior risk: a prop name that used to fall through `...rest` to `<table>` and is now consumed as an option. No `<table>` DOM attribute collides with a TanStack key by inspection, but this is not exhaustively type-checked. The requester must confirm minor is acceptable (public API change).
- Type cost: `tsc` baseline for `tsconfig.dist.json` is 111,421 types / 507,450 instantiations / 2.20s check time. It must be re-measured after the change.

### Out of Scope

- Options for unregistered features (filtering, visibility, expanding, grouping, column pinning).
- Exposing the `table` instance, or changing any Table-owned state slice or its callbacks.
- Rendering hierarchical rows from `getSubRows` (no expanding feature is registered).
- The uncommitted `hiddenKebabMenuIds` work on `fix/table-selection`. This change must not edit those hunks.
