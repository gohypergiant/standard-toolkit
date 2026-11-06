# Spec Delta

## Purpose

Defines which TanStack Table options the data-driven `Table` accepts from consumers, which options the Table keeps for itself, and the guarantee that engine options never reach the rendered `<table>` element.

## ADDED Requirements

### Requirement: Accepted engine options
The data-driven `Table` (`columns` + `data`) SHALL accept the TanStack Table options of its registered features (sorting, row selection, row pinning, pagination, row ordering, column ordering, column sizing) as props, except the options the Table owns. Accepted options keep their TanStack names, optionality and callback signatures.

#### Scenario: Consumer sets meta and defaultColumn
- **GIVEN** a Table rendered with `defaultColumn={{ size: 200 }}` and `meta={{ locale: 'en-US' }}`
- **WHEN** the table mounts
- **THEN** a consumer column with no explicit `size` renders with a 200px width
- **AND** no `defaultColumn` or `meta` attribute appears on the `<table>` element

#### Scenario: Consumer overrides the default row id
- **GIVEN** rows `{ id: 1, callsign: 'VIPER' }` and `{ id: 2, callsign: 'COBRA' }` and `getRowId={(row) => row.callsign}`
- **WHEN** the user selects the first row
- **THEN** the selection state is `{ VIPER: true }`

#### Scenario: Unregistered-feature option is rejected at compile time
- **GIVEN** `<Table columns={columns} data={data} enableFilters />` (filtering is not registered)
- **WHEN** the project is type-checked
- **THEN** compilation fails on `enableFilters`

### Requirement: Table-owned options are not overridable
The Table SHALL keep control of `features`, `data`, `columns`, `state`, `atoms`, `mergeOptions`, `key`, `manualSorting`, `manualPagination`, and the change handlers `onRowSelectionChange`, `onSortingChange`, `onRowPinningChange`, `onRowOrderingChange`, `onColumnOrderChange` and `onPaginationChange` of its owned slices. These names SHALL NOT be accepted as engine options. Owned slices SHALL continue to be driven only by their `x` / `defaultX` / `onXChange` props.

#### Scenario: Owned engine handler is a type error
- **GIVEN** `<Table columns={columns} data={data} onSortingChange={fn} />`
- **WHEN** the project is type-checked
- **THEN** compilation fails on `onSortingChange`
- **AND** `onSortChange` remains the supported way to observe sorting

#### Scenario: Owned slice cannot be seeded through initialState
- **GIVEN** `initialState={{ sorting: [{ id: 'age', desc: true }] }}` passed by a JS consumer or a type cast
- **WHEN** the table mounts
- **THEN** the rendered sort is the one derived from `sort` / `defaultSort` (default `[]`), not the `initialState` value

#### Scenario: Unowned slice can be seeded
- **GIVEN** `initialState={{ columnSizing: { callsign: 240 } }}`
- **WHEN** the table mounts
- **THEN** the `callsign` header and cells render 240px wide

### Requirement: Overridable defaults
`enableRowSelection` and `enableRowPinning` SHALL default to `true` and SHALL be replaceable by a consumer-supplied boolean or predicate function. A consumer value SHALL NOT change the Table's controlled/uncontrolled behavior for the selection and pinning slices.

#### Scenario: Selection disabled for one row
- **GIVEN** `enableRowSelection={(row) => row.original.affiliation !== 'hostile'}` and a row with `affiliation: 'hostile'`
- **WHEN** the table renders with `showCheckbox`
- **THEN** that row's checkbox is disabled and the other rows' checkboxes are enabled

#### Scenario: Defaults preserved when omitted
- **GIVEN** a Table with no `enableRowSelection` and no `enableRowPinning` prop
- **WHEN** the user selects a row and pins a row
- **THEN** both actions succeed as they do today

### Requirement: Engine options never reach the DOM
Every accepted engine option SHALL be consumed by the Table and SHALL NOT be forwarded to the `<table>` element. All other props, including `data-*`, `aria-*`, `className` and `id`, SHALL continue to be forwarded to `<table>`.

#### Scenario: Engine options absent from the DOM
- **GIVEN** a Table with `getRowId`, `meta`, `enableSortingRemoval`, `initialState` and `data-testid="tracks"`
- **WHEN** the table renders
- **THEN** the `<table>` element has `data-testid="tracks"`
- **AND** it carries no attribute named after any engine option

#### Scenario: Unrelated DOM props still pass through
- **GIVEN** a Table with `aria-label="Tracks"` and `id="track-table"`
- **WHEN** the table renders
- **THEN** the `<table>` element has `aria-label="Tracks"` and `id="track-table"`

### Requirement: Existing sort behavior is preserved
Accepted sorting options SHALL NOT change the header-menu contract: each sort action SHALL still replace the whole sort state with at most one entry, and `onSortChange` SHALL still receive the plain next `SortingState`.

#### Scenario: Multi-sort option does not enable multi-column sort
- **GIVEN** `enableMultiSort` is set to `true` and the `age` column is sorted ascending
- **WHEN** the user chooses "Sort Descending" on the `name` column
- **THEN** `onSortChange` receives `[{ id: 'name', desc: true }]`

### Requirement: Table-injected columns keep fixed width
The Table-injected numeral, selection and kebab columns SHALL keep their 32px width regardless of a consumer `defaultColumn`.

#### Scenario: defaultColumn size does not widen meta columns
- **GIVEN** `defaultColumn={{ size: 300 }}` and `showCheckbox`
- **WHEN** the table renders
- **THEN** the selection column is 32px wide and consumer columns without a `size` are 300px wide

### Requirement: Children branch rejects engine options
The static `children` branch of `Table` SHALL reject every engine option at the type level, as it does for other data-driven props.

#### Scenario: Static table rejects an engine option
- **GIVEN** `<Table defaultColumn={{ size: 200 }}><thead /></Table>`
- **WHEN** the project is type-checked
- **THEN** compilation fails on `defaultColumn`

### Requirement: Public type surface
The set of accepted engine options SHALL be part of `TableProps`. No TanStack option type SHALL be re-exported by `@accelint/design-toolkit`, and no existing export SHALL be removed or renamed.

#### Scenario: Existing consumers still type-check
- **GIVEN** a consumer that renders `<Table columns data sort onSortChange />` and extends `TableProps<Track>` with its own props
- **WHEN** it is type-checked against the new release
- **THEN** it compiles without changes
