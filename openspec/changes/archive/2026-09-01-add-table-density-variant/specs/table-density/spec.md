## Purpose

Gives the data-mode Table a density `variant` (`cozy`, `compact`, `crammed`,
default `cozy`) that flows through the table context to header cells, body
cells, meta columns, and the kebab menus, so operators can pack more rows into
dense data views without changing the table's structure or accessibility.

## ADDED Requirements

### Requirement: Table accepts a density variant in data mode
`TableProps` SHALL accept an optional `variant` of type `DensityVariant`
(`'cozy' | 'compact' | 'crammed'`) in data-table mode (when `columns` and
`data` are supplied). When omitted, the table SHALL behave exactly as
`variant='cozy'`, which is visually identical to the table before this change.
The default SHALL be the exported constant `DEFAULT_TABLE_VARIANT`
(value `'cozy'`), exported from `@accelint/design-toolkit` and from
`@accelint/design-toolkit/components/table/constants/table`, and that same
constant SHALL be the `variant` in the default `TableContext` value.

#### Scenario: Default density when the prop is omitted
- **GIVEN** a table of tracks with columns `callsign` and `altitude` and rows `[{ id: 'AF1', callsign: 'AF1', altitude: 35000 }, { id: 'RCH27', callsign: 'RCH27', altitude: 28000 }]`, rendered as `<Table columns={columns} data={rows} />`
- **WHEN** the header cells and body cells are inspected
- **THEN** every header cell and body cell carries the module's `cozy` density class, computed padding is 12px on every side (header cells 0 on the right), and none carries the `compact` or `crammed` class

#### Scenario: Explicit variant values are accepted
- **GIVEN** the same tracks table
- **WHEN** it is rendered with `variant='cozy'`, `variant='compact'`, and `variant='crammed'` in turn
- **THEN** each render type-checks and the cells carry the matching density class for that render only

#### Scenario: Unknown value is a type error
- **GIVEN** `<Table columns={columns} data={rows} variant='dense' />`
- **WHEN** the file is type-checked
- **THEN** type-checking fails on the `variant` value

#### Scenario: Root default and context default are the same constant
- **GIVEN** `import { DEFAULT_TABLE_VARIANT, TableContext } from '@accelint/design-toolkit';`
- **WHEN** a test reads `useContext(TableContext).variant` outside any provider and compares it with `DEFAULT_TABLE_VARIANT`
- **THEN** both are `'cozy'` and `expect(contextValue.variant).toBe(DEFAULT_TABLE_VARIANT)` passes

### Requirement: Density is a padding ladder on the spacing scale
Header cells and body cells SHALL apply exactly one density class matching
the active variant, and the three densities SHALL map to consecutive steps
of the design-foundation spacing scale: `cozy` = `--spacing-m` (12px),
`compact` = `--spacing-s` (8px), `crammed` = `--spacing-xxs` (2px). Header
cells SHALL keep zero right padding at `cozy` and `compact` (as today); at
`crammed` the 2px padding applies on all sides. Only `crammed` SHALL
additionally force single-line content (no wrapping) on header and body cells
and remove the 16px minimum width from body cells; `cozy` and `compact` SHALL
keep the 16px minimum width and normal wrapping. The density rules SHALL live
in the table's CSS module at the same cascade layer as the base cell rules so
consumer `className` utilities still win.

#### Scenario: Compact padding
- **GIVEN** the tracks table rendered with `variant='compact'`
- **WHEN** a body cell showing `callsign` `AF1` and its header cell are measured
- **THEN** the body cell has 8px padding on all sides and a 16px minimum width, the header cell has 8px top/bottom/left padding and 0 right padding, and content may still wrap

#### Scenario: Crammed padding, no wrapping, no minimum width
- **GIVEN** the tracks table rendered with `variant='crammed'` and a long text column value `'Reaper 21 / MQ-9 / on station until 2130Z'`
- **WHEN** that body cell and its header cell are measured
- **THEN** both have 2px padding on all sides, the text renders on a single line, and the body cell's minimum width is 0 so it can shrink below 16px

#### Scenario: Cozy is unchanged from the pre-change table
- **GIVEN** the tracks table rendered with `variant='cozy'`
- **WHEN** compared with the committed visual-regression baseline `table-default` taken before this change
- **THEN** the screenshots match within the existing threshold

#### Scenario: Exactly one density class at a time
- **GIVEN** the tracks table rendered with `variant='compact'`
- **WHEN** any header cell or body cell's class list is inspected
- **THEN** it contains the `compact` class and neither the `cozy` nor the `crammed` class

#### Scenario: Consumer className overrides density padding
- **GIVEN** a hand-composed `<TableCell className='p-xl'>AF1</TableCell>` rendered inside a `TableContext.Provider` whose value sets `variant: 'crammed'`
- **WHEN** that cell is measured
- **THEN** its padding is 24px, not 2px, because the density rule sits in the same cascade layer as the base cell rule and the consumer utility wins

### Requirement: Meta columns follow the density; their fixed width and nested controls do not change
The numeral, selection (checkbox), and kebab (row actions) columns SHALL
receive the same density class and padding as ordinary body and header
cells. Their column width SHALL stay 32px at every density. The nested
`Checkbox` (16px control), the kebab `Button` (`variant='icon'`, medium
size, 28px target), and `Icon` sizes SHALL NOT change with density, so
every interactive target stays at or above 24px even under `crammed`.

#### Scenario: Numeral, selection, and kebab cells at crammed
- **GIVEN** the tracks table rendered with `variant='crammed'`, `showCheckbox`, `persistNumerals`, and `kebabPosition='right'`
- **WHEN** the first row's numeral cell (text `1`), selection cell (contains a checkbox), and kebab cell (contains the button labelled `row 1 actions`) are inspected
- **THEN** each carries the `crammed` class with 2px padding, each has an inline width of 32px, and the checkbox and kebab button render at their unchanged sizes

#### Scenario: Selection header cell at compact
- **GIVEN** the same table with `variant='compact'`
- **WHEN** the header cell containing the select-all checkbox is inspected
- **THEN** it carries the `compact` class with 8px padding and 0 right padding, and its checkbox is the same size as at `cozy`

#### Scenario: Hidden numeral cell still carries the density class
- **GIVEN** the tracks table rendered with `variant='compact'` and `persistNumerals={false}`
- **WHEN** a body row is not hovered and its numeral cell is inspected
- **THEN** the cell carries both the hover-only visibility class and the `compact` class, so the row keeps compact height while the numeral is invisible

#### Scenario: Kebab button target size under crammed
- **GIVEN** the tracks table rendered with `variant='crammed'` and `enableRowActions`
- **WHEN** the row actions button is measured
- **THEN** its rendered box is at least 24px by 24px and its focus outline is fully visible when reached with the keyboard

### Requirement: Rows carry no density class and the table structure is unchanged
The row element SHALL NOT receive a density class; row height SHALL follow
cell padding only. Density SHALL be purely presentational: the DOM structure,
ARIA roles (`table`, `columnheader`, `row`, `cell`), accessible names
(`row N actions`, `Menu`), existing `data-selected` and `data-pinned`
attributes, tab order, and keyboard behaviour SHALL be identical across all
three densities, and no `data-density` or `data-variant` attribute SHALL be
added to any element.

#### Scenario: Row element has no density class
- **GIVEN** the tracks table rendered with `variant='crammed'`
- **WHEN** a body row's class list is inspected
- **THEN** it contains the row class and the `group/row` marker but none of `cozy`, `compact`, or `crammed`

#### Scenario: Roles and names are identical across densities
- **GIVEN** the tracks table rendered three times with `variant='cozy'`, `'compact'`, and `'crammed'`, with `showCheckbox` and `enableRowActions`
- **WHEN** the accessibility tree of each render is compared
- **THEN** the set of roles, accessible names, and their order is identical, and no element has a `data-density` attribute

#### Scenario: Row height shrinks with density
- **GIVEN** the tracks table rendered with `variant='cozy'` and again with `variant='crammed'`
- **WHEN** the height of the first body row is measured in each render
- **THEN** the crammed row is shorter than the cozy row by the padding difference (20px) plus any wrapping removed, with no explicit height set on the row

### Requirement: Kebab menus inherit the density, clamped to the Menu subset
Both the row actions menu and the header cell menu SHALL receive a `variant`
derived from the table density: `cozy` -> `cozy`, `compact` -> `compact`,
`crammed` -> `compact` (Menu does not accept `crammed`). Menu items, labels,
and behaviour SHALL be unchanged.

#### Scenario: Row actions menu at compact
- **GIVEN** the tracks table rendered with `variant='compact'`
- **WHEN** the user clicks the button labelled `row 1 actions` and the element with role `menu` opens
- **THEN** its items carry the Menu `compact` density class

#### Scenario: Row actions menu at crammed is clamped to compact
- **GIVEN** the tracks table rendered with `variant='crammed'`
- **WHEN** the user opens the row actions menu
- **THEN** the menu renders with its `compact` density (8px vertical item padding is replaced by 4px), not `cozy`, and no `crammed` class is present on the menu

#### Scenario: Header cell menu at cozy
- **GIVEN** the tracks table rendered with the default variant and `enableSorting`
- **WHEN** the user opens the header menu labelled `Menu` on the `callsign` column
- **THEN** its items carry the Menu `cozy` density class and the sort and move items are the same as before this change

### Requirement: Custom-children mode has no density surface
When `Table` is given `children` (custom-content mode), `variant` SHALL NOT be
accepted (the existing props union forbids every data-mode prop there), no
table context provider SHALL be created, and hand-composed header and body
cells SHALL render at the context default density (`cozy`). A consumer who
wants a denser hand-composed table SHALL be able to wrap the cells in the
public `TableContext.Provider` with a `variant` in its value.

#### Scenario: variant is rejected alongside children
- **GIVEN** `<Table variant='compact'><TableHeader>...</TableHeader></Table>`
- **WHEN** the file is type-checked
- **THEN** type-checking fails on `variant`, exactly as it does today for `showCheckbox` or `data` in children mode

#### Scenario: Hand-composed cells render cozy without a provider
- **GIVEN** a static table composed as `<table><thead><tr><TableHeaderCell>Callsign</TableHeaderCell></tr></thead><tbody><TableRow><TableCell>AF1</TableCell></TableRow></tbody></table>` with no provider
- **WHEN** the header cell and body cell are inspected
- **THEN** both carry the `cozy` class with 12px padding

#### Scenario: Consumer provides density through the public context
- **GIVEN** the same hand-composed cells wrapped in `<TableContext.Provider value={{ ...defaults, variant: 'crammed' }}>`
- **WHEN** the cells are inspected
- **THEN** both carry the `crammed` class with 2px padding and single-line content

### Requirement: The context value carries the density
`TableContextValue` SHALL include a required `variant: DensityVariant`
member. The root data-mode provider SHALL set it from the `variant` prop
(after defaulting), and the default context value SHALL set it to
`DEFAULT_TABLE_VARIANT`. Cells SHALL derive their density solely from this
context member, never from a DOM attribute.

#### Scenario: Provider value reflects the prop
- **GIVEN** the tracks table rendered with `variant='compact'` and a probe column whose cell reads `useContext(TableContext).variant`
- **WHEN** the probe cell renders
- **THEN** it displays `compact`

#### Scenario: Provider value defaults to the constant
- **GIVEN** the tracks table rendered with no `variant` and the same probe column
- **WHEN** the probe cell renders
- **THEN** it displays `cozy`, equal to `DEFAULT_TABLE_VARIANT`

#### Scenario: Constructing a context value without variant is a type error
- **GIVEN** `const value: TableContextValue = { ...everyOtherMember };` omitting `variant`
- **WHEN** the file is type-checked
- **THEN** type-checking fails because `variant` is required

### Requirement: Density is documented and demonstrated
The Storybook meta for Table SHALL expose a `variant` select control with
options `cozy`, `compact`, `crammed`, and SHALL include `CompactDensity` and
`CrammedDensity` stories that show checkbox, numeral, and right-side kebab
columns. The `Static` story SHALL state that custom-children mode renders
`cozy`. The Storybook docs page and the docs-site Table page SHALL document
`variant` with its three values, default, and the padding ladder. Visual
regression coverage SHALL include `table-compact`, `table-crammed`, and
`table-crammed-all-features` scenarios with committed light and dark baselines.

#### Scenario: Stories render every density
- **GIVEN** the `CompactDensity` and `CrammedDensity` stories
- **WHEN** each is rendered
- **THEN** it shows the tracks-style data with checkbox, numerals, and kebab at the named density, and changing the `variant` control on `Default` re-renders at the chosen density

#### Scenario: Visual baselines exist for each density
- **GIVEN** the visual-regression suite
- **WHEN** it runs against the committed baselines
- **THEN** `table-compact`, `table-crammed`, and `table-crammed-all-features` each have a light and a dark baseline and pass, and every pre-existing Table baseline still passes unchanged
