---
"@accelint/geo": minor
---

- Add `bearing()`, `distance()`, and `midpoint()` geodesy functions. All three accept `LonLatTuple` (`[longitude, latitude]`) parameters and are built on the `geodesy` library's `LatLonSpherical` implementation.
- `bearing(origin, destination)` computes the initial bearing in degrees (0–360) between two `[longitude, latitude]` coordinate pairs.
- `distance(origin, destination)` computes the great-circle distance in meters between two `[longitude, latitude]` coordinate pairs.
- `midpoint(origin, destination)` computes the `[longitude, latitude]` midpoint along the shortest great-circle path, so pairs straddling the antimeridian resolve near ±180 rather than near 0.
- `bearing` and `distance` return `0` for identical points, `midpoint` returns the point itself, and all three throw a `RangeError` when any coordinate component is not a finite number. Longitude and latitude are intentionally not range-checked so wrapped-map longitudes beyond ±180 keep working.
