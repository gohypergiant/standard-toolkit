---
"@accelint/map-toolkit": major
---

Fix viewport size display to use SI/ICAO-compliant unit symbols instead of uppercased abbreviations. For example, `km` instead of `KM`, `m` instead of `M`. Nautical miles changed from `nm` to `NM` per ICAO/IMO convention.

### Breaking changes

**New peer dependency:** `@accelint/constants` is now required.

**Removed exports** (from `@accelint/map-toolkit/viewport`):
- `DISTANCE_UNIT_ABBREVIATIONS` → use `DISTANCE_UNIT_SYMBOLS` from `@accelint/constants/units`
- `DistanceUnitAbbreviation` type → use `DistanceUnitSymbol` from `@accelint/constants/units`
- `DistanceUnit` type → use `DistanceUnit` from `@accelint/constants/units`
- `SupportedDistanceUnit` type → use `DistanceUnitSymbol` from `@accelint/constants/units`
- `getDistanceUnitFromAbbreviation()` → use `DISTANCE_UNIT_BY_SYMBOL[symbol]` from `@accelint/constants/units`
- `getDistanceUnitAbbreviation()` → use `DISTANCE_UNIT_SYMBOLS[unit]` from `@accelint/constants/units`

**Symbol value changes:** Unit symbols are now SI-compliant though nautical miles uses the ICAO/IMO convention of NM. If you were matching on string values, update accordingly:
- `'nm'` → `'NM'` (nautical miles)
