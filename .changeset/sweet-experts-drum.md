---
"@accelint/design-toolkit": patch
---

Fixes an issue in the Gantt component where ref-based callbacks would prevent subscriptions from firing whenever callback dependencies changed. This addresses observed layout/display bugs when modifying props.
