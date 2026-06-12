---
'@accelint/design-toolkit': patch
---

Fix `Pagination` becoming permanently unusable when `total` shrinks below the current page (e.g. after a refetch or filter change). Out-of-range state unmounted every page button and disabled both Prev and Next with no way to recover. The current page now clamps to `total`, navigation stays enabled, and `onChange` is notified of the corrected page.
