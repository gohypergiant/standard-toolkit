---
change: add-table-density-variant
created_at: "2026-09-01T15:20:37.000Z"
started_at: "2026-09-01T15:51:15.447Z"
completed_at: "2026-09-01T16:24:53.512Z"
specs_touched: [density-variant-type, table-density]
decisions:
  - id: D1
    choice: Shared `DensityVariant = 'cozy' | 'compact' | 'crammed'` in src/lib/types.ts; TreeStyleVariant, ListItemVariant, Menu and Accordion inline unions alias it (List/Menu/Accordion as Exclude<DensityVariant,'crammed'> with a brief provisional-subset comment); Table uses DensityVariant directly, no TableVariant alias
    rationale: lib/types.ts is the only shared-types file, already public via the generated barrel and ./lib/types subpath; aliases are structurally identical so apps/next subpath consumers and the barrel are untouched; minimal API surface
    alternatives: [const tuple + typeof[number], declare the union in table/types.ts as the inspiration branch did, exported subset or TableVariant aliases]
  - id: D2
    choice: Table accepts all three values as a padding ladder on the spacing scale - cozy p-m (12px), compact p-s (8px), crammed p-xxs (2px) with whitespace-nowrap and min-w-0 only at crammed; List/Menu/Accordion keep the cozy|compact subset until follow-up align-collection-density-scale migrates them
    rationale: reviewer direction at checkpoint 1 - one token per step instead of the branch's 12px to 2px jump; this ladder is the target scale for every collection component and Table is the first on it; migrating the other four is a visual change (minor bump per #926 precedent) beyond this ticket
    alternatives: [two-valued Table with compact = p-xxs (inspiration branch and first draft), two-valued shared type (breaks TreeStyleVariant), migrating Tree/List/Menu/Accordion in this change]
  - id: D3
    choice: House plumbing - variant?: DensityVariant on ExtendedTableProps (data mode only), variant required in TableContextValue, TableHeaderCell and TableCell read useContext(TableContext) and append styles[variant], explicit &.cozy / &.compact / &.crammed blocks in @layer components.l1
    rationale: identical to Tree and Menu; no new attribute, Tailwind named group, or selector strategy; the explicit &.cozy block makes styles.cozy a real module class
    alternatives: [data-density attribute + @variant group-data-[density=...]/table (inspiration branch), descendant selectors from a root table class]
  - id: D4
    choice: .headerCell and .cell (including numeral, selection, kebab cells) get the density classes; .row gets none; META_COLUMN_WIDTH stays 32px; Checkbox, kebab Button (medium) and Icon unchanged; both kebab Menus receive variant, clamped to compact for crammed
    rationale: the 2px values are proven on the inspiration branch; .row has no spacing so a row class would be dead CSS; Button size=small (20px) would drop under the 24px target minimum; Menu has no crammed
    alternatives: [per-meta-column classes, sizing Checkbox/Button per density, a row density class as a styling hook]
  - id: D5
    choice: One exported DEFAULT_TABLE_VARIANT constant in table/constants/table.ts feeds both the root prop default and the createContext default; the six 'cozy' literals in tree/list/menu/accordion stay
    rationale: Table's root and context defaults already diverge once (persistNumerals); one constant prevents a second divergence; constants/table.ts is the component's existing public constants home
    alternatives: [un-exported defaults object in context.tsx, package-wide lib/constants.ts, inline literal 'cozy']
  - id: D6
    choice: Dead Tree .item/.label variant CSS (tree/styles.module.css:64-74, 126-130) stays untouched and is called out as out of scope
    rationale: unreachable because tree/item.tsx and item-label.tsx never apply styles[variant]; fixing it is a Tree JSX and visual decision (the scale is inverted) needing its own review
    alternatives: [delete the dead rules in this change, wire styles[variant] into TreeItem/TreeItemLabel here]
  - id: D7
    choice: Custom-children mode gets nothing new - variant stays a data-mode prop (?: never in children mode), no provider is added, hand-composed cells render cozy from the context default, consumers wanting compact wrap them in the public TableContext.Provider
    rationale: minimal and identical to how every existing flag behaves in that mode; a provider for one prop would be new surface in a mode add-table-controlled-state is reshaping
    alternatives: [a children-mode provider just for variant, data-density on the bare table element]
---
## Context

See proposal.md for motivation. Paths are relative to `packages/design-toolkit/src/` unless noted.

### Current State

**Density vocabulary, declared four times with drift:** `TreeStyleVariant`
(`components/tree/types.ts:23`, `cozy | compact | crammed`); `ListItemVariant`
(`list/types.ts:23`, `cozy | compact`); Menu inline `variant?: 'compact' | 'cozy'`
(`menu/types.ts:39`); `AccordionStyleVariants = { variant?: 'compact' | 'cozy' }`
(`accordion/types.ts:26-29`). All are barrel-exported (`src/index.ts:30, 386,
428, 680`) and reachable by component subpath; `apps/next` imports
`TreeStyleVariant`, `ListItemVariant`, `MenuProps`, `AccordionProps` that way
(`apps/next/src/features/tree/tree.visual.tsx:24-28`, `list/list.visual.tsx:27`,
`menu/variants.ts:13`, `accordion/variants.ts:13`).

**`lib/types.ts` is the shared-types file** (twelve react-aria helper types,
no density type), public via the barrel (`src/index.ts:750-763`) and the
`./lib/types` subpath (`package.json:447`); the indexer
(`scripts/indexer.mjs:262-270`) hoists any `export type` from it.

**Reference flow (Tree).** Root default `variant = 'cozy'` (`tree/index.tsx:138`)
-> provider (`tree/index.tsx:225`; context default `tree/context.tsx:23`) ->
`useContext(TreeContext)` (`tree/item-content.tsx:52-56`) ->
`clsx('group', styles.content, styles[variant])` (`item-content.tsx:97`) ->
`.content { &.cozy {} &.compact {} &.crammed {} }` (`tree/styles.module.css:80-92`)
inside `@layer components.l1`. Menu is the padding-only shape
(`menu/styles.module.css:35-41`).

```
Tree today:  prop variant='cozy' --> TreeContext.Provider {variant}
                                        |  useContext(TreeContext)
                                        v
             clsx(styles.content, styles[variant]) --> .content { &.cozy | &.compact | &.crammed }
```

**Table has no density surface.** `TableProps` (`table/types.ts:33-177, 201-209`)
has no `variant`; `TableContextValue` (`types.ts:290-307`) carries only feature
flags and column selection. One provider, at the root, data mode only
(`table/index.tsx:413-439`); custom-children mode returns a bare `<table>`
(`index.tsx:404-410`) and the union marks every data-mode prop `?: never`
there (`types.ts:206-208`). Context consumers use bare `useContext(TableContext)`:
`cell.tsx:48`, `header-cell.tsx:43-51, 179`, `index.tsx:59` (`RowActionsMenu`);
`row.tsx`, `body.tsx`, `header.tsx` import none.

```
Table today: props (no variant) --> TableContext.Provider {flags, columnSelection}  (none in children mode)
             TableHeaderCell <div className={clsx('group/header-cell', styles.headerCell)}>  header-cell.tsx:196
             TableCell       <td  className={clsx(styles.cell, ...)}>                       cell.tsx:57-61
             TableRow        <tr  className={clsx('group/row', styles.row)}>                row.tsx:56
             .headerCell { p-m pr-none gap-xxs text-body-s ... }  .cell { min-w-l text-body-s p-m ... }
             .row { borders/background only }                     styles.module.css:17, 34, 48-76
```

Row height is driven purely by cell padding (no `height`/`min-height`/
`line-height` in `table/styles.module.css`). Meta columns are inline column
defs (`index.tsx:238-299`) rendered through the generic `TableCell` with
`META_COLUMN_WIDTH = 32` (`index.tsx:52`); no CSS is keyed on them. Nested:
`Checkbox` (no `size`/`variant`, `checkbox/types.ts:46-58`; 16px control,
`checkbox/styles.module.css:61`), icon `Button` at default `size='medium'`
(`p-xs`, `button/styles.module.css:314-316`), `Menu` without `variant`
(`index.tsx:72`, `header-cell.tsx:85`) although `MenuProps` accepts one.

**Inspiration branch** `origin/fix/table-column-order-density`: `density?:
'cozy' | 'compact'`, `data-density` on `<table>` styled via `@variant
group-data-[density=compact]/table`; cells `p-xxs min-w-0 whitespace-nowrap`.

### Desired End State

```
Target:  props variant (default DEFAULT_TABLE_VARIANT) --> TableContext.Provider {..., variant}
                                                              |  useContext(TableContext).variant
                                                              v
         TableHeaderCell  clsx('group/header-cell', styles.headerCell, styles[variant])
         TableCell        clsx(styles.cell, styles[variant], ...)
         RowActionsMenu / HeaderCellMenu   <Menu variant={variant}>
                                                              |
                                                              v
         .headerCell { base; &.cozy { p-m pr-none } &.compact { p-s pr-none } &.crammed { p-xxs whitespace-nowrap } }
         .cell       { base; &.cozy { p-m min-w-l } &.compact { p-s min-w-l } &.crammed { p-xxs min-w-0 whitespace-nowrap } }
```

One `DensityVariant` in `lib/types.ts`; Tree/List/Menu/Accordion alias it under
their existing names. Unchanged: DOM, roles, `data-*`, `.row` rules,
`META_COLUMN_WIDTH`, defaults, the `TableProps` union, sibling-owned code.

**Relationship to sibling changes.** `add-table-controlled-state`,
`simplify-table-row-ordering`, `fix-table-column-order` are planned in other
worktrees. This change and `add-table-controlled-state` land first, independently;
the other two rebase on both. Edits here to `index.tsx` and `types.ts` are single
additive lines (one destructured prop, one provider field, one prop type, one
context field); nothing touches `row-ordering-feature.ts`, the `data` memo, column order, or `showNumerals`.

## Goals / Non-Goals

**Goals:** `variant` on `Table` matching the other four in name, default, plumbing,
and CSS shape; one shared density type; nothing public removed; zero change for `apps/next`.

**Non-Goals:** proposal.md "Out of Scope"; memoizing the provider value
(`index.tsx:412`); the `persistNumerals` root/context default mismatch
(`index.tsx:135`); cross-component pixel parity of density levels (Tree
crammed is ~24px, Table crammed with row actions is 32px; names are relative).

## Patterns to Follow

- Plumbing `tree/index.tsx:138,225`, `tree/item-content.tsx:52-56,97`; CSS shape
  `tree/styles.module.css:77-92`, `menu/styles.module.css:35-41`; `@/lib/types` import `button/types.ts:16`.
- `table/constants/table.ts` (public constants home); `list.stories.tsx:33-39` (variant argType); `list.test.tsx:145-193` (context default tests).

## Patterns to Avoid

- `data-density` + `@variant group-data-[density=...]` (inspiration branch):
  `@variant` is for RAC state and `data-*` conditions; density is a compound
  class in every reference file.
- Hand-editing `src/index.ts` (run `pnpm index`).
- Shrinking the kebab `Button` to `size='small'` under compact (target drops
  below 24px; see Accessibility).

## Resolved Decisions

**Decision 1 - Shared type `DensityVariant` in `lib/types.ts`.** Choice:
`export type DensityVariant = 'cozy' | 'compact' | 'crammed';`. Aliases keep
every exported name: `TreeStyleVariant = DensityVariant`;
`ListItemVariant = Exclude<DensityVariant, 'crammed'>`; Menu and Accordion
inline `variant?: Exclude<DensityVariant, 'crammed'>`; Table uses
`DensityVariant` directly (no `TableVariant` alias: minimal API surface).
Each `Exclude<...>` site carries a brief comment that the subset is
provisional until `align-collection-density-scale` (follow-up) revisits it.
Rationale: `lib/types.ts` is the only shared-types file, already public by
barrel and subpath, exported by the indexer with no manual step; the aliases
are structurally identical to today's unions, so `apps/next` and the barrel
are untouched (additive). `DensityVariant` names the axis; `StyleVariant`
would blur with Button's `Variants` (`filled | flat | icon | outline`).
Alternatives: `const` tuple + `typeof[number]` (no precedent); declaring it
in `table/types.ts` as the branch did (a fifth copy); exported subset or
`TableVariant` aliases (more public surface for no new information).

**Decision 2 - Three-valued type; Table accepts all three as a padding
ladder on the spacing scale.** Choice: `cozy` = `p-m` (12px), `compact` =
`p-s` (8px), `crammed` = `p-xxs` (2px, the branch's "compact" values);
List/Menu/Accordion keep the documented `cozy | compact` subset. Rationale
(reviewer direction at checkpoint 1): each step is one token on the scale
(`tokens.css:194-197`), so compact is a real middle step instead of a 12px
to 2px jump, and Table matches Tree's three values. Only `crammed` adds
`whitespace-nowrap`/`min-w-0`, since single-line cells are what make 2px
padding usable. This ladder is the target scale for every collection
component; migrating Tree/List/Menu/Accordion (visual change, minor bump per
#926 precedent) is the follow-up change `align-collection-density-scale`.
Alternatives: two-valued Table with compact = `p-xxs` (the branch; too large
a jump); two-valued shared type (breaks `TreeStyleVariant`); migrating the
other four here (scope: one component to five).

**Decision 3 - House plumbing.** Choice: `variant?: DensityVariant` on
`ExtendedTableProps` (data mode; `?: never` in children mode via the existing
union); `variant: DensityVariant` required in `TableContextValue`;
`TableHeaderCell` and `TableCell` read it with `useContext(TableContext)` and
append `styles[variant]`; CSS moves the density-dependent utilities out of the
base rule into explicit `&.cozy` / `&.compact` / `&.crammed` blocks (Decision 4),
all in `@layer components.l1`. The explicit `&.cozy` block is required so
`styles.cozy` exists as a module class.
Rationale: identical to Tree/Menu; no new attribute or Tailwind group.
Alternatives: `data-density` (rejected); descendant selectors from a root
class (no `.table` class exists; breaks the compound-class convention).

**Decision 4 - Elements and nested components.**

| Element | cozy | compact | crammed |
|---|---|---|---|
| `.headerCell` (inner `div` of `th`) | `p-m pr-none` (today) | `p-s pr-none` | `p-xxs whitespace-nowrap` |
| `.cell` (`td`, incl. numeral/selection/kebab) | `p-m min-w-l` (today) | `p-s min-w-l` | `p-xxs min-w-0 whitespace-nowrap` |
| `.row` (`tr`) | no density class | same | same (height follows cells) |
| Meta column width | 32px (`META_COLUMN_WIDTH`) | 32px | 32px |
| `Checkbox`, kebab `Button` (`medium`), `Icon` | unchanged | unchanged | unchanged |
| both kebab `Menu`s | `variant='cozy'` | `variant='compact'` | `variant='compact'` (Menu has no `crammed`) |

Rationale: the branch proved the 2px values; `.row` has no spacing today, so
a row class would be dead CSS (the Tree `.item` mistake); `variant` on `Menu`
is one prop at two sites and keeps popover density consistent, clamped to
Menu's subset for `crammed`. Alternatives: meta-cell classes (nothing differs
per column); sizing Checkbox/Button (no API / target-size regression).

**Decision 5 - One exported default constant.** Choice:
`export const DEFAULT_TABLE_VARIANT: DensityVariant = 'cozy';` in
`table/constants/table.ts`, used by both the root destructuring default and
the `createContext` default. Rationale: Table's root and context defaults
already diverge once (`persistNumerals`); one constant prevents a second
divergence, and `constants/table.ts` is the component's existing public
constants home. The six literals in the other components stay (out of scope).
Alternatives: un-exported `ListStylesDefaults`-style object in `context.tsx`
(root cannot import it unexported); a new `lib/constants.ts` (one value).

**Decision 6 - Dead Tree `.item`/`.label` CSS: out of scope.** Choice: leave
`tree/styles.module.css:64-74` and `126-130` untouched. Rationale: research
Q15/Q16 shows they are unreachable because `tree/item.tsx:71` and
`item-label.tsx:34` never add `styles[variant]`; fixing it is a Tree JSX/CSS
decision needing its own visual review. Alternative: delete them here (a
silent Tree change inside a Table PR).

**Decision 7 - Custom-children mode.** Background: `Table` has two modes.
Data mode (`columns` + `data`) builds the rows itself and wraps them in a
`TableContext.Provider`. Custom-children mode (`<Table><TableHeader>...`
hand-written) renders a bare `<table>` with no provider, and the `TableProps`
union already forbids every data-mode prop there (`types.ts:206-208`).
Choice: nothing new for that mode. `variant` is a data-mode prop like the
rest; hand-composed cells read the context default and render cozy, and a
consumer wanting compact wraps them in the public `TableContext.Provider`.
Alternatives: a children-mode provider just for `variant` (new surface for
one prop; also the mode `add-table-controlled-state` is reshaping).

## Accessibility

Density is presentational: roles (`table`, `columnheader`, `row`, `cell`),
`aria-label`s (`row N actions`, `Menu`), tab order, and the RAC keyboard model
of Checkbox/Button/Menu are unchanged, so screen readers see the same table.
Targets under crammed (the tightest): meta columns keep 32px; `p-xxs` leaves
a 28px content box, and the icon `Button` at `medium` (20px icon + `p-xs` x2
= 28px) fits while staying above the 24px minimum, which is why `size` is not
reduced; the Checkbox control stays 16px. Compact (`p-s`) is looser than
that. Focus rings are outlines (`button/styles.module.css:59`,
`checkbox/styles.module.css:67`) and `.cell` sets no `overflow`, so 2px
padding does not clip them; the CrammedDensity story is keyboard-tabbed
during review to confirm.

## Storybook Stories and Tests

`table.stories.tsx`: add `args.variant: 'cozy'` and `argTypes.variant: { control:
'select', options: ['cozy', 'compact', 'crammed'] }` to meta (every story gains the
control), plus `CompactDensity` and `CrammedDensity` stories (checkbox, numerals,
kebab right) showing cells, meta columns, and the kebab menu. `Static` documents
that custom-children mode renders `cozy`. Reference stories need no edits. VR: add
`variant` to `TableScenario`/`renderScenario`; scenarios `table-compact`, `table-crammed`, `table-crammed-all-features`.

Tests (`table.test.tsx`, `describe('Table variant')`, assert with imported
`styles.cozy`/`styles.compact` so the class strategy is irrelevant):
- `should apply the cozy class to header cells and cells by default`
- `should apply the compact and crammed classes to header cells and cells` (`it.each`)
- `should apply the variant to numeral, selection, and kebab cells`
- `should pass compact to the row kebab menu for compact and crammed` (`role='menu'`)
- `should render cozy for cells composed without a Table provider`
- `constants/table.ts`: `DEFAULT_TABLE_VARIANT` equals the context default.

## Risks / Trade-offs

- `whitespace-nowrap` widens long-text columns at crammed -> intended; consumers override via `className`.
- `.cell.cozy` specificity -> still `@layer components.l1`, consumer utilities win.
- Sibling rebases on `index.tsx`/`types.ts` -> additive single-line edits.

## Open Questions

No unresolved questions.
