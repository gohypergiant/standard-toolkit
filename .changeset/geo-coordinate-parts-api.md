---
"@accelint/geo": minor
---

Add a coordinate "parts" API that returns the structured pieces of a formatted coordinate instead of only a finished string. `toDecimalDegreesParts(value, axis, precision?)`, `toDdmParts(value, axis, precision?)`, and `toDmsParts(value, axis, precision?)` take a signed number plus its axis and return the non-negative `degrees`/`minutes`/`seconds` numbers and the `hemisphere` letter (`'N' | 'S' | 'E' | 'W'`), with the `60″ → +1′ → +1°` and `60′ → +1°` carry already applied. `toMgrsParts([lat, lon])` and `toUtmParts([lat, lon])` read the grid fields directly and return a discriminated result — `{ ok: true, value: … }` for in-band coordinates or `{ ok: false, reason: 'out-of-range' }` for latitudes outside the inclusive `80°S`–`84°N` band, and for a longitude of exactly `+180°` (the antimeridian, where the UTM zone is undefined) — so callers can branch on validity without matching thrown error text, and never have to guard against a thrown exception. The supporting types (`DecimalDegreesParts`, `DdmParts`, `DmsParts`, `MgrsParts`, `UtmParts`, `GridPartsResult`) are exported alongside them.

The existing `format*`/`parse*` functions and `createCoordinate(...).mgrs()`/`.utm()` now compose over this parts layer internally; their string output is byte-identical to before.
