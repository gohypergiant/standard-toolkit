---
"@accelint/map-toolkit": patch
---

Fix 2.5D tilt not sticking when a UI control toggles the view to 2.5D. `BaseMap` now raises MapLibre's `maxPitch` whenever a non-zero pitch is being applied, not just while the view is already `2.5D`, so a `setView('2.5D')` that sets `view` and `pitch:60` in the same render no longer has its pitch clamped back to flat. Consumers no longer need to re-assert the pitch on a later tick after switching views.
