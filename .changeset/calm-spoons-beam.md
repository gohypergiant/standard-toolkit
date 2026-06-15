---
"@accelint/map-toolkit": minor
---

2.5D view now allows right click & drag to pitch and rotate the camera. default pitch was updated to 60 degrees instead of 45 degrees. The pitch is overridable via the `pitch` property when initializing camera state (`initializeCameraState`) or by emitting a `setPitch` event while in 2.5D.
