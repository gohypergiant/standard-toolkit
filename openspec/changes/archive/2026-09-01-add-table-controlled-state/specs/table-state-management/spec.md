## Purpose

Defines the controlled/uncontrolled contract for every state slice the `Table` component owns (`rowSelection`, `rowPinning`, `sort`, `page`): one naming triple per slice, plain-value change callbacks, and the adoption rule that later Table changes follow for their own slices.

## ADDED Requirements

### Requirement: Per-slice naming triple
Every Table-owned state slice SHALL be exposed as three props: `x` (controlled value), `defaultX` (uncontrolled initial value), and `onXChange` (change callback). The slice SHALL be uncontrolled by default and controlled exactly when `x !== undefined`. The Table SHALL NOT copy a prop into internal state after mount and SHALL NOT support switching a slice between controlled and uncontrolled modes at runtime.

The slices covered by this change and their triples:

| Slice | Controlled | Default | Callback | Value type |
| --- | --- | --- | --- | --- |
| row selection | `rowSelection` | `defaultRowSelection` | `onRowSelectionChange` | `RowSelectionState` (`Record<string, true>`) |
| row pinning | `rowPinning` | `defaultRowPinning` | `onRowPinningChange` | `RowPinningState` (`{ top: string[]; bottom: string[] }`) |
| sort | `sort` | `defaultSort` | `onSortChange` | `SortingState` (`Array<{ id: string; desc: boolean }>`) |
| page | `page` | `defaultPage` | `onPageChange` | `number` (1-indexed) |

#### Scenario: Uncontrolled slice seeded from its default
- **GIVEN** a Table rendered with `defaultRowSelection={{ tanner: true, joe: true }}` and no `rowSelection` prop
- **WHEN** the table mounts
- **THEN** the rows with ids `tanner` and `joe` render with checked checkboxes and `data-selected="true"`
- **AND** later user interaction updates the selection internally without any callback being required

#### Scenario: Controlled slice reflects the prop after mount
- **GIVEN** a parent holding `const [selection, setSelection] = useState({ tanner: true })` and rendering `<Table rowSelection={selection} onRowSelectionChange={setSelection} />`
- **WHEN** the parent calls `setSelection({})` (for example from a "Clear selection" button outside the Table)
- **THEN** the `tanner` checkbox renders unchecked on the next render without a remount

#### Scenario: Controlled slice without a callback is frozen
- **GIVEN** a Table rendered with `rowSelection={{ tanner: true }}` and no `onRowSelectionChange`
- **WHEN** the user clicks the `joe` checkbox
- **THEN** the rendered selection stays `{ tanner: true }` (only `tanner` checked)
- **AND** no error is thrown

#### Scenario: Default value ignored while controlled
- **GIVEN** a Table rendered with `rowSelection={{ joe: true }}` and `defaultRowSelection={{ tanner: true }}`
- **WHEN** the table mounts
- **THEN** only `joe` is checked; `defaultRowSelection` has no effect

#### Scenario: Mode switch after mount is a development warning
- **GIVEN** a Table first rendered with `defaultSort={[]}` (uncontrolled)
- **WHEN** a later render passes `sort={[{ id: 'age', desc: true }]}`
- **THEN** in non-production builds a console warning reports the change from uncontrolled to controlled
- **AND** the Table renders the controlled value from that render onward

### Requirement: Change callbacks receive plain values
Every `onXChange` callback SHALL be invoked synchronously with the fully resolved next value of the slice. The Table SHALL resolve any functional updater produced by its internal table engine before invoking the consumer callback; a consumer SHALL never receive a function. The callback SHALL NOT be invoked when the resolved next value is the same reference as the current value.

#### Scenario: Toggling one row emits the whole next selection
- **GIVEN** a Table with rows `tanner`, `tandy`, `joe`, `showCheckbox`, `rowSelection={{ tanner: true }}` and a spy `onRowSelectionChange`
- **WHEN** the user clicks the `joe` checkbox
- **THEN** the spy is called once with an object equal to `{ tanner: true, joe: true }`
- **AND** `typeof` the argument is `'object'`, not `'function'`

#### Scenario: React state setter wiring works unchanged
- **GIVEN** a parent wiring `onRowSelectionChange={setSelection}` where `setSelection` comes from `useState`
- **WHEN** the user toggles rows
- **THEN** the parent state equals the Table's rendered selection after every interaction

#### Scenario: Deselecting removes the key rather than setting false
- **GIVEN** `rowSelection={{ tanner: true, joe: true }}` with a spy callback
- **WHEN** the user unchecks `joe`
- **THEN** the spy receives `{ tanner: true }` with no `joe` key (`RowSelectionState` is `Record<string, true>`)

#### Scenario: Select-all against an already-controlled value
- **GIVEN** rows `tanner`, `tandy`, `joe` and `rowSelection={{ tanner: true }}` with a spy callback
- **WHEN** the user clicks the header select-all checkbox
- **THEN** the spy receives `{ tanner: true, tandy: true, joe: true }`
- **AND** while the parent has not yet applied the value, the rendered checkboxes still reflect `{ tanner: true }`

### Requirement: Row selection is controllable
The `rowSelection` prop SHALL be the controlled value of the selection slice (it was previously read only as an initial value). `defaultRowSelection` SHALL carry the initial-only meaning. Selection keys SHALL be Table row ids: the row's `id` converted to a string when `id` is truthy, otherwise the row's index in `data` as a string.

#### Scenario: Static selection survives a data refetch
- **GIVEN** `rowSelection={{ tanner: true }}` wired to parent state and a `data` prop that is replaced by a new array with the same ids
- **WHEN** the new `data` array renders
- **THEN** `tanner` remains checked and no callback fires

#### Scenario: Selection keyed by string form of numeric id
- **GIVEN** rows with `id: 7` and `id: 8`
- **WHEN** `rowSelection={{ '7': true }}` is passed
- **THEN** the row with `id: 7` renders checked

#### Scenario: Falsy row id falls back to the index key
- **GIVEN** `data` where the first item has `id: 0` and the second has `id: 'joe'`
- **WHEN** `rowSelection={{ '0': true }}` is passed
- **THEN** the first row (index 0) renders checked
- **AND** if that same item later sits at index 2 of `data`, the key `'0'` no longer matches it (documented limitation; the key follows the index, not the item)

#### Scenario: Selection key for a row no longer in data
- **GIVEN** `rowSelection={{ ghost: true, tanner: true }}` where no row has id `ghost`
- **WHEN** the table renders
- **THEN** `tanner` is checked, no row is checked for `ghost`, and the header select-all checkbox is indeterminate (some but not all rows selected)

### Requirement: Row pinning is controllable
The Table SHALL expose `rowPinning`, `defaultRowPinning` (defaulting to `{ top: [], bottom: [] }`) and `onRowPinningChange(RowPinningState)`. The row kebab "Pin" / "Unpin" actions SHALL continue to write the pinning slice, adding the row id to `top` on pin and removing it on unpin. Pinned rows SHALL render before unpinned rows in `top` order, then unpinned rows in data order, then `bottom` rows.

#### Scenario: Default pinning renders pinned rows first
- **GIVEN** rows `tanner`, `tandy`, `joe` in data order and `defaultRowPinning={{ top: ['joe'], bottom: [] }}`
- **WHEN** the table mounts
- **THEN** the first body row is `joe` with `data-pinned="top"` and the remaining rows are `tanner`, `tandy` in data order

#### Scenario: Pin action emits the next pinning state
- **GIVEN** `rowPinning={{ top: ['joe'], bottom: [] }}` wired to parent state and a spy `onRowPinningChange`
- **WHEN** the user opens row `tanner`'s kebab menu and chooses "Pin"
- **THEN** the spy receives `{ top: ['joe', 'tanner'], bottom: [] }` as a plain object

#### Scenario: Unpin action removes the id
- **GIVEN** `rowPinning={{ top: ['joe', 'tanner'], bottom: [] }}` wired to parent state
- **WHEN** the user opens row `joe`'s kebab menu and chooses "Unpin"
- **THEN** the next state is `{ top: ['tanner'], bottom: [] }` and `joe` returns to data order

#### Scenario: Controlled pinning cleared from outside
- **GIVEN** `rowPinning` wired to parent state holding `{ top: ['joe'], bottom: [] }`
- **WHEN** the parent sets `{ top: [], bottom: [] }` from an "Unpin all" button
- **THEN** no row has `data-pinned` and rows render in data order

#### Scenario: Pinned id no longer in data is skipped, not pruned
- **GIVEN** `rowPinning={{ top: ['ghost', 'joe'], bottom: [] }}` where no row has id `ghost`
- **WHEN** the table renders
- **THEN** `joe` renders pinned first, no row renders for `ghost`, and `onRowPinningChange` is not called to remove `ghost` (the controlling owner is responsible for pruning)

#### Scenario: Controlled pinning without a callback is frozen
- **GIVEN** `rowPinning={{ top: [], bottom: [] }}` and no `onRowPinningChange`
- **WHEN** the user chooses "Pin" on row `tanner`
- **THEN** `tanner` does not gain `data-pinned` and the row order is unchanged

### Requirement: Page slice is the reference implementation
The `page` / `defaultPage` / `onPageChange` triple SHALL keep its current behavior: `page` is 1-indexed, `defaultPage` defaults to `1`, `onPageChange` receives a plain number, and the slice only takes effect when `pageSize` is provided.

#### Scenario: Uncontrolled page seeded from defaultPage
- **GIVEN** 26 rows named `first-1` .. `first-26`, `pageSize={10}` and `defaultPage={2}`
- **WHEN** the table mounts
- **THEN** rows `first-11` through `first-20` render and `first-1` does not

#### Scenario: Controlled page receives a plain number
- **GIVEN** `page={1}` wired to parent state and a spy `onPageChange`
- **WHEN** the user clicks "Next page"
- **THEN** the spy is called with `2`

### Requirement: Column highlight state stays internal
The transient "which header menu is open" state, which also drives the column highlight (`data-selected` on that column's header and cells), SHALL NOT be exposed as a controlled prop and SHALL NOT be added to the Table's public props.

#### Scenario: Highlight follows the open header menu
- **GIVEN** a Table with `enableSorting`
- **WHEN** the user opens the `age` header kebab menu
- **THEN** the `age` header cell and every `age` body cell carry `data-selected="true"`
- **AND** closing the menu removes the attribute
- **AND** no Table prop influences this state

### Requirement: Additional Table-owned slices adopt the same contract
Any later change that promotes a Table-owned state slice to the public API (for example row ordering or column order) SHALL expose it as `x` / `defaultX` / `onXChange` with the semantics above: uncontrolled by default, controlled when `x !== undefined`, functional updaters from the table engine resolved internally, and the consumer callback invoked with the plain next value. The single internal adapter that implements this for `rowSelection`, `rowPinning` and `sort` SHALL be reusable for those slices without changes to its signature.

#### Scenario: New slice wired through the shared adapter
- **GIVEN** a future slice `rowOrdering` with value type `string[]`
- **WHEN** it is exposed publicly
- **THEN** it is rendered from `rowOrdering ?? internal state`, seeded from `defaultRowOrdering`, and `onRowOrderingChange` receives a `string[]` (never a function)

### Requirement: Public API and type surface
The Table SHALL accept the new props (`defaultRowSelection`, `rowPinning`, `defaultRowPinning`, `onRowPinningChange`, `sort`, `defaultSort`) only in the data-driven branch (`columns` + `data`); the static `children` branch SHALL reject them at the type level. The state value types (`RowSelectionState`, `RowPinningState`, `SortingState`) SHALL NOT be re-exported by `@accelint/design-toolkit`; consumers import them from the `@tanstack/react-table` peer dependency. `TableContext`, `TableContextValue` and every existing export of `@accelint/design-toolkit` SHALL be unchanged by this change.

#### Scenario: Static table rejects state props
- **GIVEN** `<Table rowSelection={{ a: true }}><thead /></Table>` (children branch)
- **WHEN** the project is type-checked
- **THEN** compilation fails on `rowSelection` (typed `never` in that branch)

#### Scenario: Consumer imports state types from the peer
- **GIVEN** a consumer typing `onSortChange`
- **WHEN** they write `import type { SortingState } from '@tanstack/react-table'`
- **THEN** the handler `(sort: SortingState) => void` is assignable to `onSortChange`
- **AND** `@accelint/design-toolkit` does not export a `SortingState` symbol

#### Scenario: Breaking callback and prop semantics are declared
- **GIVEN** the change is released
- **WHEN** consumers read the release notes
- **THEN** the notes state that `rowSelection` is now controlled (use `defaultRowSelection` for initial-only), that `onRowSelectionChange` receives `RowSelectionState` (drop updater branches), and that `onSortChange` receives `SortingState` in both modes (read `sort[0]?.id` / `sort[0]?.desc`), under a major version bump of `@accelint/design-toolkit`
