---
"@accelint/map-toolkit": patch
---

`CoffinCornerExtension` now uses a single packed `vec2` vertex attribute (`instanceCoffinCornerState`) for selection and hover state instead of two float attributes. WebGL caps a program at 16 vertex attributes and `IconLayer` already uses 11, so this frees one for custom `IconLayer` hosts that add their own per-instance attributes — previously an `IconLayer` subclass adding four attributes failed to link with the extension attached. Rendering is unchanged.
