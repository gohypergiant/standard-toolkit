---
related: [table-state-management]
last_touched_by: add-table-controlled-state
last_touched_on: 2026-09-01
---

## Purpose

Defines how the `Table` component sorts: the `sort` / `defaultSort` / `onSortChange` contract, the header kebab menu's sort actions in client-side and `manualSorting` modes, and how the sort indicator, menu item availability, and `aria-sort` reflect the active sort.

## Requirements

### Requirement: Sort state triple
The Table SHALL expose sort state as `sort` (controlled `SortingState`), `defaultSort` (uncontrolled initial `SortingState`, defaulting to `[]`), and `onSortChange` receiving the plain next `SortingState`. `SortingState` is `Array<{ id: string; desc: boolean }>` keyed by column id. The same triple SHALL apply in client-side and `manualSorting` modes. `onSortChange` SHALL NOT be invoked with `(columnId, direction)` arguments.

#### Scenario: Uncontrolled sort seeded from defaultSort
- **GIVEN** columns `firstName` and `age`, rows `tanner` (24), `tandy` (40), `joe` (45), and `defaultSort={[{ id: 'age', desc: true }]}`
- **WHEN** the table mounts in client-side mode
- **THEN** rows render in the order `joe`, `tandy`, `tanner`
- **AND** the `age` header has `aria-sort="descending"` and shows the down-arrow indicator

#### Scenario: Controlled sort prop drives the table after mount
- **GIVEN** a parent holding `const [sort, setSort] = useState<SortingState>([])` rendering `<Table sort={sort} onSortChange={setSort} />`
- **WHEN** the parent calls `setSort([{ id: 'firstName', desc: false }])` from a button outside the Table
- **THEN** the `firstName` header gets `aria-sort="ascending"` and, in client-side mode, rows reorder to `joe`, `tandy`, `tanner` (alphabetical)

#### Scenario: Controlled sort without a callback is frozen
- **GIVEN** `sort={[{ id: 'age', desc: true }]}` and no `onSortChange`
- **WHEN** the user opens the `age` header menu and chooses "Sort Ascending"
- **THEN** `aria-sort` on `age` stays `"descending"` and the row order is unchanged

#### Scenario: Callback receives the plain SortingState
- **GIVEN** a spy `onSortChange` and no sort applied
- **WHEN** the user chooses "Sort Descending" from the `age` header menu
- **THEN** the spy is called once with `[{ id: 'age', desc: true }]`
- **AND** the argument is an array, not a function and not a `(columnId, direction)` pair

### Requirement: Header menu sort actions produce a single-column sort
The header kebab menu SHALL offer "Sort Ascending", "Sort Descending" and "Clear Sort" when `enableSorting` is true. Each action SHALL replace the whole sort state with at most one entry for the acted-on column: ascending emits `[{ id, desc: false }]`, descending emits `[{ id, desc: true }]`, clear emits `[]`. The menu SHALL behave identically in client-side and `manualSorting` modes; the mode SHALL only decide whether rows are reordered client-side.

#### Scenario: Sort Ascending from unsorted
- **GIVEN** no sort applied and a spy `onSortChange`
- **WHEN** the user chooses "Sort Ascending" on `age`
- **THEN** the spy receives `[{ id: 'age', desc: false }]`

#### Scenario: Sort Descending replaces ascending on the same column
- **GIVEN** `sort={[{ id: 'age', desc: false }]}` (controlled, wired to state)
- **WHEN** the user chooses "Sort Descending" on `age`
- **THEN** the next state is `[{ id: 'age', desc: true }]`

#### Scenario: Sorting another column replaces the previous column
- **GIVEN** the current sort is `[{ id: 'age', desc: true }]`
- **WHEN** the user chooses "Sort Ascending" on `firstName`
- **THEN** the next state is `[{ id: 'firstName', desc: false }]` with no `age` entry (no multi-column sort)

#### Scenario: Clear Sort emits an empty array
- **GIVEN** the current sort is `[{ id: 'age', desc: true }]`
- **WHEN** the user chooses "Clear Sort" on `age`
- **THEN** the next state is `[]`
- **AND** `aria-sort` is absent from every header and rows return to data order in client-side mode

### Requirement: Menu item availability reflects the active sort
Each sort menu item SHALL be disabled when choosing it would not change the sort state for that column: "Sort Ascending" disabled while the column is sorted ascending, "Sort Descending" disabled while sorted descending, "Clear Sort" disabled while the column is unsorted. This SHALL hold in both client-side and `manualSorting` modes.

#### Scenario: Unsorted column
- **GIVEN** no sort applied
- **WHEN** the user opens the `age` header menu
- **THEN** "Sort Ascending" and "Sort Descending" are enabled and "Clear Sort" is disabled

#### Scenario: Column sorted descending
- **GIVEN** the sort is `[{ id: 'age', desc: true }]`
- **WHEN** the user opens the `age` header menu
- **THEN** "Sort Descending" is disabled and "Sort Ascending" and "Clear Sort" are enabled

#### Scenario: Other column while one is sorted
- **GIVEN** the sort is `[{ id: 'age', desc: true }]`
- **WHEN** the user opens the `firstName` header menu
- **THEN** "Sort Ascending" and "Sort Descending" are enabled and "Clear Sort" is disabled (the sort belongs to `age`)

### Requirement: Manual sorting mode reflects state without reordering rows
When `manualSorting` is true the Table SHALL NOT reorder rows client-side; rows SHALL render in `data` order. The sort indicator, menu item availability and `aria-sort` SHALL still reflect the `sort` / `defaultSort` value so that a consumer who sorts on the server sees the same affordances as client-side mode.

#### Scenario: Server-side sort round trip
- **GIVEN** `manualSorting`, `sort` wired to parent state, `onSortChange` that stores the state and re-sorts `data` in the parent, and rows `tanner` (24), `tandy` (40), `joe` (45)
- **WHEN** the user chooses "Sort Descending" on `age`
- **THEN** `onSortChange` receives `[{ id: 'age', desc: true }]`
- **AND** after the parent passes the re-sorted `data`, rows render `joe`, `tandy`, `tanner` and the `age` header has `aria-sort="descending"` with the down-arrow indicator

#### Scenario: Manual mode does not reorder on its own
- **GIVEN** `manualSorting` and `sort={[{ id: 'age', desc: true }]}` with `data` still in insertion order `tanner`, `tandy`, `joe`
- **WHEN** the table renders
- **THEN** rows render `tanner`, `tandy`, `joe` (unchanged)
- **AND** the `age` header still has `aria-sort="descending"` and the down-arrow indicator

#### Scenario: Manual mode Clear Sort is available once sorted
- **GIVEN** `manualSorting` and `sort={[{ id: 'age', desc: false }]}`
- **WHEN** the user opens the `age` header menu
- **THEN** "Clear Sort" is enabled and "Sort Ascending" is disabled

### Requirement: Sort indicator and aria-sort reflect the active sort
Each sortable header `<th>` SHALL expose `aria-sort="ascending"` or `aria-sort="descending"` when its column is the sorted column and SHALL omit the attribute otherwise. The header kebab icon SHALL be replaced by an up-arrow (ascending) or down-arrow (descending) indicator for the sorted column while not hovered. This SHALL hold in both client-side and `manualSorting` modes.

#### Scenario: Ascending indicator
- **GIVEN** the sort is `[{ id: 'firstName', desc: false }]`
- **WHEN** the header row renders
- **THEN** the `firstName` header has `aria-sort="ascending"` and renders the up-arrow indicator
- **AND** the `age` header has no `aria-sort` attribute

#### Scenario: Descending indicator in manual mode
- **GIVEN** `manualSorting` and `sort={[{ id: 'age', desc: true }]}`
- **WHEN** the header row renders
- **THEN** the `age` header has `aria-sort="descending"` and renders the down-arrow indicator

#### Scenario: No sort applied
- **GIVEN** `sort={[]}`
- **WHEN** the header row renders
- **THEN** no header has an `aria-sort` attribute and every header shows the kebab icon

### Requirement: Sorting is triggered only from the header menu
Sorting SHALL be initiated only through the header kebab menu items. Clicking or pressing keys on the header label SHALL NOT change the sort. Documentation and story descriptions SHALL describe the menu, not header clicks. When `enableSorting` is false the sort menu items SHALL be absent.

#### Scenario: Header label click is inert
- **GIVEN** `enableSorting` and no sort applied
- **WHEN** the user clicks the `age` header label text
- **THEN** the sort state is unchanged and no `aria-sort` attribute appears

#### Scenario: Sorting disabled
- **GIVEN** `enableSorting={false}` and `enableColumnReordering`
- **WHEN** the user opens the `age` header menu
- **THEN** only the column reordering items are present; no "Sort Ascending" / "Sort Descending" / "Clear Sort" items exist

## Related Specs

- [table-state-management](../table-state-management/spec.md) - Defines the controlled/uncontrolled contract for every state slice the `Table` component owns (`rowSelection`, `rowPinning`, `sort`, `page`): one naming triple per slice, plain-value change callbacks, and the adoption rule that later Table changes follow for their own slices.
