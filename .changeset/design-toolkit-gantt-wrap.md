---
"@accelint/design-toolkit": patch
---

Replace the hand-rolled signed-modulo idioms in the Gantt `roundMsToInterval` date utility with `@accelint/math`'s `wrap` primitive (adds `@accelint/math` as a dependency). Output is unchanged for every input, including negative timestamps; this only consolidates the sub-second, interval, and into-day boundary math onto one tested implementation.
