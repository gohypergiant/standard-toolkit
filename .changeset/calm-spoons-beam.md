---
"@accelint/map-toolkit": minor
---

2.5D view now allows right click & drag to pitch and rotate the camera. default pitch was updated to 60 degrees instead of 45 degrees. The pitch is overridable via the `pitch` property when initializing camera state (`initializeCameraState`) or by emitting a `setPitch` event while in 2.5D. Pitch is clamped to the renderable range, and the maximum is exported as the `MAX_PITCH` constant from `@accelint/map-toolkit/camera` so consumers can bound their own pitch UI without hardcoding the value.
