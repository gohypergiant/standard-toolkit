---
"@accelint/map-toolkit": minor
---

Add map mode system with authorization flow for managing interaction modes.

**New Features:**

- `MapProvider` component for managing map mode state with instance isolation
- `useMapMode()` hook for accessing and requesting mode changes
- Authorization flow for resolving ownership conflicts when switching modes
- Event bus integration for decoupled mode change communication
- Support for multiple independent map instances with isolated state

**API:**

- `MapProvider` component (internal to `BaseMap`)
- `useMapMode(id)` hook for UI components
- `BaseMap` now requires `id` prop for instance identification
- Observable store pattern using React's `useSyncExternalStore`
