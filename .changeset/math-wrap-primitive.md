---
"@accelint/math": minor
---

Add `wrap(min, max, value)` for cycling a number into the half-open range `[min, max)`. Where `clamp` pins an out-of-range value to the nearest edge, `wrap` treats the range as circular — a value past `max` re-enters at `min`, and one below `min` re-enters just under `max` — handling negative and multi-revolution inputs. Common for angles (`wrap(0, 360, angle)`) and longitudes (`wrap(-180, 180, lon)`). Throws a `RangeError` when `min >= max`.
