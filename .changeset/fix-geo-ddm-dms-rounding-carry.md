---
'@accelint/geo': patch
---

Fix `formatDegreesDecimalMinutes` and `formatDegreesMinutesSeconds` producing impossible values when rounding rolls over: minutes/seconds that rounded to exactly 60 (e.g. `40.9999995` formatting as `40° 60.0000'`) now carry into the higher unit (`41° 0.0000'`).
