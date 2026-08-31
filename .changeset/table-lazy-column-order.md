---
'@accelint/design-toolkit': patch
---

fix(table): derive column order from the columns prop until a manual move

Column order state was seeded from the columns present at mount, so a column
added to the `columns` prop later rendered at the tail instead of its given
position. The seed is gone: until a manual Move Column Left/Right, the columns
prop order is authoritative, and the order array is materialized lazily on the
first move.
