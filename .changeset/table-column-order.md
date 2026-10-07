---
"@accelint/design-toolkit": minor
---

Add controlled column order to `Table`. `columnOrder`, `defaultColumnOrder`, and `onColumnOrderChange` follow the same convention as sorting, row selection, and row pinning: uncontrolled by default, seedable, and controlled when the value prop is set. The order names your own column ids only; the numeral, selection, and kebab columns stay in place. Column order now follows later `columns` prop changes instead of being fixed at mount, and the header menu's Move Column Left / Right items are disabled at the edges of your columns. `onColumnReorderChange` is deprecated in favor of `onColumnOrderChange`.
