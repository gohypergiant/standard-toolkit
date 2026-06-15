---
'@accelint/design-toolkit': patch
---

Fix `CoordinateField` in controlled mode wiping all segments during edits. Emptying one segment (or entering an invalid coordinate) emits `onChange(null)`; when the parent echoed that `null` back into the `value` prop, the field re-synced from it and cleared every segment and any just-set validation error. The field now recognizes echoes of its own `onChange` emissions and leaves in-progress edits and validation errors intact.
