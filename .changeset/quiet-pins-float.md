---
"@accelint/design-toolkit": minor
---

Add floating card pinning feature and new placement props.

- Cards can be pinned to disable dragging via a `'pin'` header action
- `togglePinCard` and `isPinned` added to the floating card context
- New `FloatingCardHeaderAction` type supports `'pin'` alongside existing `'divider'` and custom button actions
- `FloatingCardProvider` accepts `initialPinned` to pre-pin cards at mount time
- `FloatingCard` accepts `initialPosition` (`{ x, y }`) to set the starting coordinates of the panel
- `FloatingCard` accepts `initialDimensions` (`{ width, height }`) to set the starting size of the panel (defaults to `300 × 400`)
