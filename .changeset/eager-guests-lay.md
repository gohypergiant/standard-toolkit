---
"@accelint/map-toolkit": patch
---

Fix infinite render loop in BaseMap when navigating in React Strict Mode. The camera store's `createMapStore` now properly handles initial state timing by directly updating existing instances when `setInitialState` is called after the instance already exists, which can occur during React Strict Mode's double-mount behavior.
