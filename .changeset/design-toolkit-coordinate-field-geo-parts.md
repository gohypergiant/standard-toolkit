---
"@accelint/design-toolkit": patch
---

`CoordinateField` now computes its display segments from `@accelint/geo`'s coordinate parts API (`toDdmParts`/`toDmsParts`/`toMgrsParts`/`toUtmParts`) instead of formatting a coordinate to a string and parsing it back apart with regexes. The five private regex parse-back helpers were removed, and `getAllCoordinateFormats` no longer builds a `createCoordinate` object. The public `parseCoordinateStringToSegments`, `convertDDToDisplaySegments`, and `getAllCoordinateFormats` keep their signatures, segment shapes, and ordering.

Two outputs change, both fixes:

- **DDM/DMS carry.** Values within rounding distance of a minute or second boundary now carry into the next unit (`40.99999999°` renders as `41° 0'` instead of the invalid `40° 60'`).
- **DD precision.** Decimal-degrees segments and the DD full-format string share one renderer: fixed notation, 10 decimal places, trailing zeros trimmed. Float artifacts round away as before, and magnitudes below `1e-6` now display as `0.0000001` rather than `1e-7` (and, with the matching `@accelint/geo` fix, parse back).
