---
'@accelint/design-toolkit': minor
---

feat(table): `density` and `showNumerals` props

`density='compact'` tightens header/body cell padding and keeps cell content
on a single line for dense data tables; the value is also exposed as
`data-density` on the table element. `showNumerals={false}` omits the numeral
column entirely, unlike `persistNumerals` which only controls hover
visibility.
