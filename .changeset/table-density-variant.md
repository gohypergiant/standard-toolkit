---
'@accelint/design-toolkit': minor
---

feat(table): `variant` density prop (`cozy` | `compact` | `crammed`, default
`cozy`) applied to header cells, body cells, meta columns, and kebab menus;
new shared `DensityVariant` type in `lib/types`, aliased by Tree/List/Menu/
Accordion under their existing names; new `DEFAULT_TABLE_VARIANT` constant.
Crammed cells clip overflowing content with an ellipsis so long values
cannot bleed into neighboring cells under a fixed table layout (`fullWidth`).
No breaking changes.
