---
"@accelint/constants": minor
---

- Add `METERS_PER_UNIT` to `@accelint/constants/units`: meters in one of each `DistanceUnit` (`kilometers`, `meters`, `nauticalmiles`, `miles`, `feet`). The table is declared `as const`, so it is readonly and each factor is typed as its literal value. Gives `@accelint/formatters` and `@accelint/map-toolkit` one shared conversion table instead of three private copies with differing precision.
