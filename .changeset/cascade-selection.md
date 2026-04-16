---
'@accelint/design-toolkit': minor
---

Add semantic cascade selection mode to Tree component. When enabled via `selectionCascade` prop on `useTreeState`, selecting a parent node automatically selects all descendants, and parent checkboxes show indeterminate state when partially selected. Includes performance optimizations for large trees and automatic cascade state synchronization after drag-and-drop operations.