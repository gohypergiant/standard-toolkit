## Purpose

One shared density vocabulary (`cozy | compact | crammed`) for design-toolkit
collection components, exported once from the package so Tree, List, Menu,
Accordion, and Table describe density with the same type instead of four
drifting copies.

## ADDED Requirements

### Requirement: Shared density union is public API
The package SHALL export a type named `DensityVariant` whose members are
exactly the string literals `'cozy'`, `'compact'`, and `'crammed'`. It SHALL
be importable from the package root (`@accelint/design-toolkit`) and from the
`@accelint/design-toolkit/lib/types` subpath, alongside the existing shared
react-aria helper types. The root barrel entry SHALL be produced by the
package indexer, never by hand.

#### Scenario: Importing the union from the package root
- **GIVEN** a consumer file `import type { DensityVariant } from '@accelint/design-toolkit';`
- **WHEN** it declares `const density: DensityVariant = 'compact';`
- **THEN** type-checking passes

#### Scenario: Importing the union from the lib/types subpath
- **GIVEN** a consumer file `import type { DensityVariant } from '@accelint/design-toolkit/lib/types';`
- **WHEN** it declares `const densities: DensityVariant[] = ['cozy', 'compact', 'crammed'];`
- **THEN** type-checking passes

#### Scenario: Value outside the vocabulary is rejected
- **GIVEN** `import type { DensityVariant } from '@accelint/design-toolkit';`
- **WHEN** a file declares `const density: DensityVariant = 'dense';`
- **THEN** type-checking fails with a type error on the string literal

#### Scenario: Union has exactly three members
- **GIVEN** a type-level test `expectTypeOf<DensityVariant>().toEqualTypeOf<'cozy' | 'compact' | 'crammed'>()`
- **WHEN** the package types are checked
- **THEN** the assertion holds and no fourth member (for example `'dense'` or `'comfortable'`) is accepted

### Requirement: Tree keeps its full three-valued variant under the existing name
`TreeStyleVariant` SHALL remain exported from `@accelint/design-toolkit` and
from `@accelint/design-toolkit/components/tree/types`, and SHALL be
structurally identical to `DensityVariant` (all three members). `TreeProps['variant']`
and `TreeItemContentRenderProps['variant']` SHALL continue to accept `'crammed'`.

#### Scenario: Existing Tree consumer compiles unchanged
- **GIVEN** the existing visual-regression file that imports `TreeStyleVariant` from `@accelint/design-toolkit/components/tree/types` and declares `const DENSITIES: TreeStyleVariant[] = ['cozy', 'compact', 'crammed'];`
- **WHEN** the workspace is type-checked
- **THEN** the file compiles with no edits

#### Scenario: Tree accepts crammed
- **GIVEN** `<Tree variant='crammed' aria-label='Units'>...</Tree>`
- **WHEN** the file is type-checked
- **THEN** it passes, and `TreeStyleVariant` is assignable to and from `DensityVariant` in both directions

### Requirement: List, Menu, and Accordion keep the provisional two-valued subset under their existing names
`ListItemVariant`, `MenuProps['variant']`, and `AccordionStyleVariants['variant']`
SHALL be expressed as the subset of `DensityVariant` that excludes `'crammed'`
(that is, exactly `'cozy' | 'compact'`), SHALL keep their current exported
names and export paths, and SHALL carry a brief source comment stating that
the subset is provisional until the follow-up change
`align-collection-density-scale` revisits it. Their runtime defaults SHALL
remain `'cozy'`.

#### Scenario: List rejects crammed
- **GIVEN** `import type { ListItemVariant } from '@accelint/design-toolkit/components/list/types';`
- **WHEN** a file declares `const v: ListItemVariant = 'crammed';`
- **THEN** type-checking fails with a type error, while `'cozy'` and `'compact'` are accepted

#### Scenario: Menu variant is the two-valued subset
- **GIVEN** `import type { MenuProps } from '@accelint/design-toolkit/components/menu/types';`
- **WHEN** a file declares `type V = NonNullable<MenuProps<object>['variant']>;` and asserts `expectTypeOf<V>().toEqualTypeOf<'cozy' | 'compact'>()`
- **THEN** the assertion holds

#### Scenario: Accordion variant is the two-valued subset
- **GIVEN** `<Accordion variant='crammed'>` in a consumer file
- **WHEN** the file is type-checked
- **THEN** type-checking fails, while `<Accordion variant='compact'>` and `<AccordionGroup variant='cozy'>` pass

#### Scenario: Existing List and Menu visual-regression consumers compile unchanged
- **GIVEN** the existing files that import `ListItemVariant` from `@accelint/design-toolkit/components/list/types` and `MenuProps` from `@accelint/design-toolkit/components/menu/types` and derive `NonNullable<MenuProps<object>['variant']>`
- **WHEN** the workspace is type-checked
- **THEN** both compile with no edits

### Requirement: No public name is removed or renamed
Introducing the shared type SHALL be purely additive. Every type currently
exported from the package root for Tree, List, Menu, and Accordion
(`TreeStyleVariant`, `TreeProps`, `ListItemVariant`, `ListProps`, `MenuProps`,
`AccordionStyleVariants`, `AccordionProps`, `AccordionGroupProps`) SHALL still
be exported under the same name from the same path, and no `TableVariant`
alias SHALL be added. The change SHALL be published as a minor version bump.

#### Scenario: Root barrel still exports every prior name
- **GIVEN** the regenerated package root after `pnpm index`
- **WHEN** a file imports `TreeStyleVariant`, `ListItemVariant`, `AccordionStyleVariants`, `MenuProps`, and `DensityVariant` from `@accelint/design-toolkit`
- **THEN** all five resolve, and importing `TableVariant` from the same specifier is a type error

#### Scenario: Structural identity with the previous unions
- **GIVEN** the previous declarations `'cozy' | 'compact' | 'crammed'` (Tree) and `'cozy' | 'compact'` (List, Menu, Accordion)
- **WHEN** each aliased name is compared with `expectTypeOf<...>().toEqualTypeOf<...>()` against its previous literal union
- **THEN** every comparison holds, so no downstream consumer sees a widened or narrowed type
