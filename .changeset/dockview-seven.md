---
'@accelint/design-toolkit': major
---

Upgrade FloatingCard to Dockview 7.

BREAKING CHANGES for FloatingCard consumers:

- The `dockview-react` peer dependency must be upgraded to `^7.0.4`.
- `FloatingCardContextValue.api` now exposes Dockview 7's `DockviewApi` type.
- Applications using `FloatingCard` must import
  `@accelint/design-toolkit/components/floating-card/styles.css` once from
  their global stylesheet.
