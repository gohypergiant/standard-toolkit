# Tasks: add-table-density-variant

Paths are relative to `packages/design-toolkit/src/` unless noted. Every slice is
an end-to-end, testable increment; run `pnpm run build` (the authoritative
type-check for design-toolkit) at the end of each slice before moving on.
Read and write files in chunks (sed -n ranges, appended heredocs); never dump
a large file whole. Never hand-edit `src/index.ts`; run `pnpm index`.

## 1. Slice 1: shared `DensityVariant` + aliases, build green, apps/next unchanged [PKG:design-toolkit]

Depends on: nothing. Independent of Slices 2 and 3 at the file level except
that Slice 2 imports the type this slice creates.

- [x] 1.1 [PKG:design-toolkit] Add `export type DensityVariant = 'cozy' | 'compact' | 'crammed';` with JSDoc to `lib/types.ts` (next to the react-aria helper types). Verify: `pnpm --filter @accelint/design-toolkit tsc --noEmit -p tsconfig.dist.json` passes.
- [x] 1.2 [PKG:design-toolkit] Re-point `tree/types.ts:23` to `export type TreeStyleVariant = DensityVariant;` (import from `@/lib/types`), keeping the exported name and JSDoc. Verify: `TreeProps['variant']` and `TreeItemContentRenderProps['variant']` still accept `'crammed'` (type-check `tree/tree.stories.tsx` and `tree/lines.tsx` unchanged).
- [x] 1.3 [PKG:design-toolkit] Re-point `list/types.ts:23` to `export type ListItemVariant = Exclude<DensityVariant, 'crammed'>;`, Menu's inline union at `menu/types.ts:39` to `variant?: Exclude<DensityVariant, 'crammed'>;`, and Accordion's at `accordion/types.ts:28` likewise; add a one-line comment at each of the three sites that the subset is provisional until `align-collection-density-scale`. Verify: `list.stories.tsx`, `menu.stories.tsx`, `accordion.stories.tsx`, `group.stories.tsx` still type-check with `options: ['cozy', 'compact']`.
- [x] 1.4 [PKG:design-toolkit] Add a type-level test `lib/types.test-d.ts` (same convention as `packages/core/src/safe-enum/**/index.test-d.ts`) using vitest `expectTypeOf`: `DensityVariant` equals `'cozy' | 'compact' | 'crammed'`; `TreeStyleVariant` equals `DensityVariant`; `ListItemVariant`, `NonNullable<MenuProps<object>['variant']>`, and `NonNullable<AccordionStyleVariants['variant']>` each equal `'cozy' | 'compact'`; `'crammed'` is not assignable to `ListItemVariant`. Verify: `pnpm --filter @accelint/design-toolkit tsc --noEmit -p tsconfig.dev.json` (which includes test files) passes, and `pnpm --filter @accelint/design-toolkit vitest run --typecheck lib/types.test-d.ts` is green; temporarily flip one assertion to confirm it fails, then restore it.
- [x] 1.5 [PKG:design-toolkit] Run `pnpm index` from the package (or `pnpm indexer` at root) so `src/index.ts` gains `DensityVariant` in the `from './lib/types'` block. Verify: `git diff packages/design-toolkit/src/index.ts` shows exactly one added line and no removed names (`TreeStyleVariant`, `ListItemVariant`, `AccordionStyleVariants`, `MenuProps` all still present); no `TableVariant` is exported.
- [x] 1.6 [PKG:next] Confirm the downstream consumers compile with zero edits: `apps/next/src/features/tree/tree.visual.tsx` (`TreeStyleVariant[]` with `'crammed'`), `list/list.visual.tsx` (`ListItemVariant`), `menu/variants.ts` (`NonNullable<MenuProps<object>['variant']>`), `accordion/variants.ts` (`AccordionProps`). Verify: `pnpm run build` at the repo root is green and `git status apps/next` shows no changes.

**Deliverable:** One shared `DensityVariant` exported from the package root and `./lib/types`; Tree/List/Menu/Accordion alias it under their existing names; regenerated barrel; type-level tests; nothing removed.

**Test:** `pnpm run build` green across the monorepo; the new `expectTypeOf` assertions pass; `git diff --stat` touches only `lib/types.ts`, the four `types.ts` files, the new test file, and `src/index.ts` (one added line).

## 2. Slice 2: Table `variant` prop through context to cells, cozy/compact/crammed CSS, unit tests [PKG:design-toolkit]

Depends on: Slice 1 (imports `DensityVariant` from `@/lib/types`). Touches
`table/index.tsx` and `table/types.ts` only with single additive lines
(one destructured prop, one provider field, one prop type, one context field)
so the sibling changes can rebase cleanly. Do not touch
`row-ordering-feature.ts`, the `data` memo, column order, or `showNumerals`.

- [x] 2.1 [PKG:design-toolkit] Write the failing tests first in `table/table.test.tsx` under a new top-level `describe('Table variant')` (max 2 describe levels, strict matchers, `import styles from './styles.module.css'` so assertions use `styles.cozy` / `styles.compact` / `styles.crammed`; a tracks fixture with `callsign` and `altitude` columns and ids `AF1`, `RCH27`): `should apply the cozy class to header cells and cells by default`; `should apply the compact and crammed classes to header cells and cells` (`it.each` over `compact` and `crammed`, asserting the other two classes are absent); `should apply the variant to numeral, selection, and kebab cells` (with `showCheckbox`, `persistNumerals`, checking the cell containing `getByTestId('numeral')` for row 1, the cell containing the row checkbox, and the cell containing `getByRole('button', { name: 'row 1 actions' })`); `should keep the variant class on a hidden numeral cell` (`persistNumerals={false}`, cell has both `styles.hideInRow` and `styles.compact`); `should not apply a density class to rows` (`getAllByRole('row')` carry none of the three); `should render cozy for cells composed without a Table provider` (reuse the existing `setup()` fixture, which renders hand-composed cells with no provider). Verify: `pnpm --filter @accelint/design-toolkit vitest run table/table.test.tsx` shows exactly these tests failing and every pre-existing test still passing.
- [x] 2.2 [PKG:design-toolkit] Add `export const DEFAULT_TABLE_VARIANT: DensityVariant = 'cozy';` with JSDoc to `table/constants/table.ts`, plus a test in a new `table/constants/table.test.ts` (or the existing constants test if one exists): `DEFAULT_TABLE_VARIANT` is `'cozy'` and equals the `variant` of the default `TableContext` value (`renderHook(() => useContext(TableContext))` with no provider). Verify: the test fails now (context has no `variant`) and passes after 2.3.
- [x] 2.3 [PKG:design-toolkit] Plumb the prop: in `table/types.ts` add `variant?: DensityVariant;` with JSDoc (three values, default, padding ladder) to `ExtendedTableProps` next to `fullWidth`, and add `variant: DensityVariant;` to `TableContextValue`; in `table/context.tsx` add `variant: DEFAULT_TABLE_VARIANT` to the `createContext` default; in `table/index.tsx` destructure `variant = DEFAULT_TABLE_VARIANT` and add `variant` to the provider value (one line each). Verify: `pnpm --filter @accelint/design-toolkit tsc --noEmit -p tsconfig.dist.json` passes; `<Table variant='compact'>{children}</Table>` is a type error (children mode) and `<Table columns data variant='dense' />` is a type error (confirm with a `// @ts-expect-error` line in `lib/types.test-d.ts` or a scratch file, then keep only the `test-d` assertions).
- [x] 2.4 [PKG:design-toolkit] Apply the class: `table/header-cell.tsx` `TableHeaderCell` reads `variant` from `useContext(TableContext)` (extend the existing destructure at line 179) and renders `clsx('group/header-cell', styles.headerCell, styles[variant], className)`; `table/cell.tsx` extends its destructure (line 48) and renders `clsx(styles.cell, styles[variant], notPersistNums && styles.hideInRow, className)`. `row.tsx` is not touched. Verify: the 2.1 tests that check class presence now pass except the CSS-dependent ones are still class-only (jsdom does not compute `@apply` padding; padding is covered by VR in Slice 3).
- [x] 2.5 [PKG:design-toolkit] Move density utilities out of the base rules in `table/styles.module.css` (`@layer components.l1`): `.headerCell` base drops `p-m pr-none` and gains `&.cozy { @apply p-m pr-none; } &.compact { @apply p-s pr-none; } &.crammed { @apply p-xxs whitespace-nowrap; }`; `.cell` base drops `p-m min-w-l` and gains `&.cozy { @apply p-m min-w-l; } &.compact { @apply p-s min-w-l; } &.crammed { @apply p-xxs min-w-0 whitespace-nowrap; }`. Everything else (`hover`, `selected`, `selection-end`, `.row`, `.hideInRow`, `.hideInHeader`) unchanged. Verify: `pnpm --filter @accelint/design-toolkit build` compiles the CSS module; `styles.cozy`, `styles.compact`, `styles.crammed` are defined strings at runtime (the 2.1 tests would otherwise assert `undefined`); in Storybook `Default` the cozy table is pixel-identical to before (compare against `apps/next/src/features/table/__screenshots__/table-default-light-chromium-linux.png` by eye or by running `pnpm --filter @apps/next visual` for the existing scenarios, which must all still pass).

**Deliverable:** `variant` on data-mode `Table` (default `DEFAULT_TABLE_VARIANT`), carried by `TableContextValue`, applied by `TableHeaderCell` and `TableCell` as `styles[variant]` with explicit `&.cozy / &.compact / &.crammed` blocks; unit tests for default, each value, meta columns, hidden numeral, no row class, and provider-less cells.

**Test:** `pnpm --filter @accelint/design-toolkit test` green including the new `Table variant` describe and the constants test; `pnpm run build` green; existing Table VR scenarios unchanged (`pnpm --filter @apps/next visual` passes for all 11 pre-existing `table-*` baselines).

## 3. Slice 3: kebab menus, stories, VR scenarios, docs [PKG:design-toolkit] [PKG:next] [PKG:docs]

Depends on: Slice 2 (needs `variant` in `TableContextValue` and the CSS
ladder). 3.1 and 3.2 are design-toolkit source; 3.3 is apps/next (VR only);
3.4 is docs only. 3.2 through 3.4 are independent of each other and can be
split across people once 3.1 is in.

- [x] 3.1 [PKG:design-toolkit] Kebab menus inherit the density, clamped to Menu's subset. Add the failing test first in the `Table variant` describe: `should pass compact to the row kebab menu for compact and crammed` (`it.each` over `compact` and `crammed`; `userEvent.click(getByRole('button', { name: 'row 1 actions' }))`, then assert the `role='menu'` element's items carry the Menu module's `compact` class, imported from `../menu/styles.module.css`; also assert the default table's menu items carry the Menu `cozy` class). Then in `table/index.tsx` `RowActionsMenu` read `variant` from `useContext(TableContext)` (extend the line-59 destructure) and render `<Menu variant={variant === 'crammed' ? 'compact' : variant}>`; do the same in `table/header-cell.tsx` `HeaderCellMenu` (extend the lines 43-51 destructure, `<Menu variant=...>` at line 85). Extract the clamp into a small local helper only if it is used twice. Verify: the new tests pass; the sorting/reorder tests in `table.test.tsx` still pass (menu items unchanged).
- [x] 3.2 [PKG:design-toolkit] Stories in `table/table.stories.tsx`: add `variant: 'cozy'` to meta `args` and `variant: { control: 'select', options: ['cozy', 'compact', 'crammed'] }` to `argTypes` (sibling `options`, matching the four reference components); add `CompactDensity` and `CrammedDensity` stories (`showCheckbox: true`, `persistNumerals: true`, `kebabPosition: 'right'`, `persistRowKebabMenu: true`, `key={JSON.stringify(args)}` like `Default`) with a `docs.description.story` sentence naming the padding step; add a `docs.description.story` line to `Static` saying custom-children mode renders `cozy` and points at `TableContext.Provider` for denser hand-composed tables. Verify: `pnpm --filter @accelint/design-toolkit storybook` (or `build-storybook`) renders both stories; keyboard-tab through `CrammedDensity` (checkbox, kebab button, open menu) and confirm focus rings are not clipped and the kebab button is at least 24px tall (DevTools box model).
- [x] 3.3 [PKG:next] Visual regression: in `apps/next/src/features/table/variants.ts` add `variant?: 'cozy' | 'compact' | 'crammed'` to `TableScenario`, extend `ScenarioName` with `'compact'`, `'crammed'`, and `'crammed all features'`, and add three `PROP_COMBOS` entries: `table-compact.png` (default props + `variant: 'compact'`), `table-crammed.png` (`variant: 'crammed'`), `table-crammed-all-features.png` (`variant: 'crammed'` with `showCheckbox`, `persistNumerals`, `persistRowKebabMenu`, `persistHeaderKebabMenu`, `enableRowActions`, `kebabPosition: 'right'`, mirroring the existing `all features` entry). In `table.visual.tsx` pass `variant={scenario.variant}` through `renderScenario`. Generate baselines with `pnpm --filter @apps/next visual:update` (Chromium via Playwright; if the local run cannot produce Linux-identical PNGs, use the "Update Visual Regression Snapshots" workflow on the PR branch instead and note that in the summary) and commit-stage the six new PNGs under `__screenshots__/`. Verify: `pnpm --filter @apps/next visual` passes: 6 new baselines (3 scenarios x light/dark) plus all 22 pre-existing ones unchanged; eyeball `table-crammed-all-features-light` for 2px padding, 32px meta columns, and no clipped kebab button.
- [x] 3.4 [PKG:design-toolkit] [PKG:docs] Docs: in `table/table.docs.mdx` add a `## Variants` section (mirroring `list.docs.mdx:63-68`: table of `cozy` 12px / `compact` 8px / `crammed` 2px + single-line cells, default `cozy`, note that custom-children mode renders `cozy`) and a `variant` row in the `## Props` table; in `apps/docs/content/docs/toolkits/design-toolkit/components/table.mdx` add `variant?: 'cozy' | 'compact' | 'crammed'` to the `TableProps` reference block and a `#### \`variant\`` subsection under `### Props` matching the tree.mdx format, with the three bullets, the default, and the kebab-menu clamp. Check `apps/docs/.index.json` first: there is no Table entry, so do not add one and do not create a parallel doc tree. Verify: `pnpm --filter @apps/docs build` (or `dev`) renders the page with the new subsection; `pnpm run lint` reports no MDX issues.

**Deliverable:** Row and header kebab `Menu`s receive the clamped density; `variant` control plus `CompactDensity` / `CrammedDensity` stories; three new VR scenarios with committed light/dark baselines; `table.docs.mdx` and the docs-site Table page document `variant`.

**Test:** `pnpm --filter @accelint/design-toolkit test` green including the menu tests; `pnpm --filter @apps/next visual` green with 28 Table baselines; Storybook shows both density stories and the `variant` control on every Table story; docs build green.

## 4. Slice 4: verification gate + changeset [PKG:design-toolkit]

Depends on: Slices 1 through 3 complete.

- [x] 4.1 Run the verification gate from the repo root in order: `pnpm run build`, `pnpm run test`, `pnpm run lint`, `pnpm run format`. Fix every failure at its cause (never `--no-verify`, never hand-edit `src/index.ts`; rerun `pnpm index` if the barrel drifts). Verify: all four commands exit 0; paste the summary line of each into the completion report.
- [x] 4.2 [PKG:design-toolkit] Create the changeset with `pnpm changeset`: `'@accelint/design-toolkit': minor`, body along the lines of "feat(table): `variant` density prop (`cozy` | `compact` | `crammed`, default `cozy`) applied to header cells, body cells, meta columns, and kebab menus; new shared `DensityVariant` type in `lib/types`, aliased by Tree/List/Menu/Accordion under their existing names; new `DEFAULT_TABLE_VARIANT` constant. No breaking changes." No changeset for `@apps/next` or `@apps/docs` (tests/docs only). Verify: the file exists under `.changeset/` with exactly one package entry and `git status` shows it staged alongside the source changes.
- [x] 4.3 Final review against the specs: walk each `#### Scenario` in `specs/density-variant-type/spec.md` and `specs/table-density/spec.md` and map it to a test, VR baseline, or type assertion; confirm `git diff --stat` touches nothing under `tree/styles.module.css` (dead CSS stays), `row.tsx`, `row-ordering-feature.ts`, or any file the sibling changes own; confirm the only edits in `table/index.tsx` and `table/types.ts` are the additive lines from 2.3 and 3.1. Verify: every scenario has a mapped check; report the mapping in the completion summary. Do not commit; leave that decision to the engineer.

**Deliverable:** Green verification gate, one minor changeset for `@accelint/design-toolkit`, scenario-to-test mapping in the completion summary.

**Test:** `pnpm run build && pnpm run test && pnpm run lint && pnpm run format` all exit 0 from the repo root; `ls .changeset/*.md` includes the new file.

## Parallelization Strategy

**Sequential vs parallel.**
- Slice 1 (shared type + aliases) must land before Slice 2 starts, because
  `table/types.ts` imports `DensityVariant` from `@/lib/types`. It is small
  (about 30 minutes) and is the only slice that touches Tree/List/Menu/
  Accordion, so keep it isolated and land it first.
- Slice 2 (prop, context, cells, CSS, unit tests) is one person's work and
  is internally sequential (tests first, then constant, types, JSX, CSS).
- Slice 3 fans out after 3.1: once the kebab menus read `variant` from
  context (3.1, design-toolkit source), tasks 3.2 (stories), 3.3 (apps/next
  VR), and 3.4 (docs) touch disjoint files and can run in parallel with up to
  three subagents or people. 3.3 should wait for 3.2's keyboard check only if
  it reveals a padding change; otherwise they are independent.
- Slice 4 is strictly last: the gate needs every source change present, and
  the changeset text names the final API.
- Concurrency cap: never more than three parallel workers on this change
  (the AGENTS.md limit is five; three is the natural fan-out here).

**Recommended order.** 1.1 -> 1.2 -> 1.3 -> 1.4 -> 1.5 -> 1.6 -> build green ->
2.1 (failing tests) -> 2.2 -> 2.3 -> 2.4 -> 2.5 -> build/test green ->
3.1 -> { 3.2 | 3.3 | 3.4 in parallel } -> 4.1 -> 4.2 -> 4.3.

**Cross-change landing order.** `add-table-density-variant` (this change) and
`add-table-controlled-state` land first and are independent of each other;
`simplify-table-row-ordering` and `fix-table-column-order` then rebase on
both. This change's only touch points in `table/index.tsx` and `table/types.ts`
are single additive lines: one destructured `variant = DEFAULT_TABLE_VARIANT`,
one `variant` field in the provider value, one `variant?: DensityVariant`
prop on `ExtendedTableProps`, one `variant: DensityVariant` field on
`TableContextValue` (plus the two one-line `<Menu variant=...>` edits in
`RowActionsMenu` and `HeaderCellMenu`). It never edits
`row-ordering-feature.ts`, the `data` reorder memo, column-order state, or
`showNumerals`, so a rebase in either direction should apply cleanly.
