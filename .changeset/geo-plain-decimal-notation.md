---
"@accelint/geo": patch
---

Fix parsing and formatting of coordinate magnitudes below `1e-6°` (within about 11 cm of the equator or prime meridian). JavaScript renders such numbers in exponential notation (`String(0.0000001)` is `'1e-7'`), which the lexer mis-tokenized — the `-7` read as a sign, so `'0.0000001 N / 0 E'` failed with "Bearing (N) conflicts with negative number" — and which `createCoordinate(...).dd()`/`.ddm()`/`.dms()` emitted verbatim. Both paths now use the new `toPlainDecimalString(value)` helper, which renders any number in plain decimal notation; ordinary coordinates are unaffected.
