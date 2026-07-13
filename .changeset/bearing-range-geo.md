---
"@accelint/geo": minor
---

- Add `bearing()` and `distance()` geodesy functions. Both functions accept `[lon, lat]` input and are built on the `geodesy` library's `LatLonSpherical` implementation.
- `bearing(pointA, pointB)` computes the initial bearing in degrees (0–360) between two `[lon, lat]` coordinate pairs.
- `distance(pointA, pointB)` computes the great-circle distance in meters between two `[lon, lat]` coordinate pairs.
