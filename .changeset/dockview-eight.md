---
'@accelint/design-toolkit': major
---

Upgrade the `dockview-react` peer dependency from `^5.0.0` to `^8.0.0` and add
a global stylesheet export.

Dockview no longer injects its own stylesheet, so its structural CSS now has to
be loaded by the application. `FloatingCard` needs that CSS to render.

BREAKING CHANGES for `FloatingCard` consumers:

- Upgrade the `dockview-react` peer dependency to `^8.0.0`.
- Import `@accelint/design-toolkit/styles` once, alongside the existing
  `@accelint/design-foundation/styles` import:

  ```css
  @import '@accelint/design-foundation/styles';
  @import '@accelint/design-toolkit/styles';
  ```

Applications that do not use `FloatingCard` do not need the new import, but
adding it is harmless and is recommended so future components that rely on
third-party global CSS work without another breaking change.
