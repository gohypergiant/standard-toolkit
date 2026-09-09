---
"@accelint/design-toolkit": patch
---

`CoordinateField` now computes its display segments from `@accelint/geo`'s coordinate parts API (`toDecimalDegreesParts`/`toDdmParts`/`toDmsParts`/`toMgrsParts`/`toUtmParts`) instead of formatting a coordinate to a string and parsing it back apart with regexes. The five private regex parse-back helpers were removed. The public `parseCoordinateStringToSegments`, `convertDDToDisplaySegments`, and `getAllCoordinateFormats` keep their signatures and produce identical segment values and ordering, so there is no user-visible change.
