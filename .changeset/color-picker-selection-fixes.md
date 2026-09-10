---
'@accelint/design-toolkit': major
---

Rename the `ColorPicker` prop `allowNull` to `allowEmptySelection`.

Also fix `ColorPicker` selection state when optional empty-selection and custom-color controls are enabled, align the helper control props/docs with runtime behavior, and normalize `ColorPicker` change callbacks to return `Color` objects or `undefined` when cleared.
