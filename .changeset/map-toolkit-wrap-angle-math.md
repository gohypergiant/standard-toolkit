---
"@accelint/map-toolkit": patch
---

Replace the hand-rolled `((x % range) + range) % range` modulo idiom in `normalizeLongitude` (cursor-coordinates), the shape-editing angle normalizer, and the rectangle-scale corner-index normalization with `@accelint/math`'s new `wrap` primitive. Output is unchanged for every input; this only consolidates the shared wrap math onto one tested implementation.
