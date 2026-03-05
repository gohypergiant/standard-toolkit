---
"@accelint/map-toolkit": major
---

Fix viewport size display to use SI-compliant unit symbols instead of uppercased abbreviations. For example, `km` instead of `KM`, `m` instead of `M`. Nautical miles remain `NM` per ICAO/IMO convention.

BREAKING CHANGE: Distance unit constants and `DISTANCE_UNIT_BY_SYMBOL` reverse lookup have moved to `@accelint/constants/units`. The `getDistanceUnitFromSymbol` helper has been removed — use `DISTANCE_UNIT_BY_SYMBOL[symbol]` directly.
