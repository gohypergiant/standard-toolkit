## Why

Table is the only data-dense design-toolkit component without a density
`variant`; Tree, List, Menu, and Accordion all expose one (default `cozy`),
and operators need a compact table for dense data views. The vocabulary is
declared four times over (`tree/types.ts:23`, `list/types.ts:23`,
`menu/types.ts:39`, `accordion/types.ts:28`); a fifth copy would add drift.

Driving requirement: give `Table` a `variant` prop following the house pattern
(prop -> context -> `clsx(styles.x, styles[variant])` -> `&.cozy` rules) and
give the vocabulary one shared home. `origin/fix/table-column-order-density`
supplies compact spacing values only; its `data-density` mechanism is not used.

## What Changes

- Add a shared three-valued density union (`'cozy' | 'compact' | 'crammed'`)
  to `packages/design-toolkit/src/lib/types.ts`; the generated barrel and the
  existing `./lib/types` subpath export it automatically.
- Re-point `TreeStyleVariant`, `ListItemVariant`, Menu's inline union, and
  `AccordionStyleVariants['variant']` at the shared type (Tree = full union;
  List/Menu/Accordion = `cozy | compact` subset, each with a brief comment
  that the subset is provisional). All exported names stay; the types are
  structurally identical, so `apps/next` subpath consumers are unaffected.
- Add `variant?: 'cozy' | 'compact' | 'crammed'` (default `'cozy'`) to
  `TableProps` (data-table mode), carry it in `TableContextValue`, apply it
  in `TableHeaderCell` and `TableCell` via `styles[variant]` with `&.cozy` /
  `&.compact` / `&.crammed` rules in `table/styles.module.css`. Padding
  ladder: cozy `p-m` (12px), compact `p-s` (8px), crammed `p-xxs` (2px) plus
  `whitespace-nowrap` (`min-w-0` on cells). Meta columns (numeral, selection,
  kebab) are ordinary cells and inherit this; both kebab `Menu`s receive the
  variant (clamped to `compact` for crammed).
- One exported default constant in `table/constants/table.ts` feeds both the
  root prop default and the context default.
- Stories (`variant` control + `CompactDensity`/`CrammedDensity` stories),
  tests in `table.test.tsx`, VR scenarios in `apps/next`, and docs
  (`table.docs.mdx`, `apps/docs/.../components/table.mdx`).

No **BREAKING** changes; nothing is removed or renamed.

## Capabilities

### New Capabilities
- `density-variant-type`: one shared `cozy | compact | crammed` union in
  `lib/types.ts`; Tree/List/Menu/Accordion alias it (or its subset) under
  their existing exported names.
- `table-density`: `Table` accepts `variant` (`cozy` | `compact` | `crammed`,
  default `cozy`); the value flows through `TableContext` to header cells,
  body cells, meta columns, and kebab menus; custom-children mode has no
  provider and ignores it.

### Modified Capabilities
None. No spec under `openspec/specs/` covers Table, Tree, List, Menu,
Accordion, or density (`INDEX.md` lists only api-doc, grid, docs-*, stepper-*).

## Out of Scope

- `add-table-controlled-state` (sibling change, other worktree): the
  controlled/uncontrolled convention and adapter; `rowSelection`,
  `rowPinning`, `sorting` triples; the `columnSelection` decision.
- `simplify-table-row-ordering` (sibling): `row-ordering-feature.ts`, the
  `data` reorder memo in `table/index.tsx`,
  `rowOrdering`/`defaultRowOrdering`/`onRowOrderingChange`.
- `fix-table-column-order` (sibling): `columnOrder`/`defaultColumnOrder`/
  `onColumnOrderChange`, meta-column placement, `onColumnReorderChange`
  semantics, `showNumerals`. The inspiration branch's `showNumerals` and lazy
  column-order fix are ignored here.
- The `data-density` attribute + `@variant group-data-[density=...]/table`
  mechanism (not the house style).
- Migrating Tree/List/Menu/Accordion to the ladder and adding `crammed` to them:
  follow-up `align-collection-density-scale` (visual change; minor per #926).
- Consolidating the six existing `'cozy'` literals in tree/list/menu/accordion
  into a shared constant (pure refactor).
- The dead Tree `.item`/`.label` variant CSS (`tree/styles.module.css:64-74`,
  `126-130`): never applied by any element; a Tree fix unrelated to Table.
- Correcting `apps/docs/.../list.mdx:42,54,63` (over-states List's union as
  including `crammed`); any change to `Checkbox`/`Button`/`Icon` sizing APIs.

Landing order: this change and `add-table-controlled-state` land first
(independent); the other two siblings rebase on both.

## Impact

Packages touched:
- `packages/design-toolkit` (source): `src/lib/types.ts`,
  `components/{tree,list,menu,accordion}/types.ts`,
  `components/table/{types.ts,context.tsx,index.tsx,cell.tsx,header-cell.tsx,styles.module.css,constants/table.ts}`,
  `src/index.ts` (via `pnpm index`), stories, tests, `table.docs.mdx`.
- `apps/next` (VR only): `src/features/table/{variants.ts,table.visual.tsx}`
  plus new baselines under `__screenshots__/`.
- `apps/docs` (docs only): `content/docs/toolkits/design-toolkit/components/table.mdx`.

Downstream dependents: `apps/next` imports `TreeStyleVariant`,
`ListItemVariant`, `TreeProps`, `ListProps`, `MenuProps`, `AccordionProps` via
`@accelint/design-toolkit/components/<name>/types`; names and shapes are
preserved. Nothing outside the package imports the Table types.

Public API: additive only (`TableProps.variant`, `TableContextValue.variant`,
`DensityVariant`, `DEFAULT_TABLE_VARIANT`; no `TableVariant` alias). Semver: minor. Changeset: one
`'@accelint/design-toolkit': minor`; none for `apps/next`/`apps/docs`
(tests/docs only). No new dependencies.
