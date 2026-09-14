# @accelint/geo

## 0.7.0

### Minor Changes

- dcaba41: Add a coordinate "parts" API that returns the structured pieces of a formatted coordinate instead of only a finished string. `toDecimalDegreesParts(value, axis, precision?)`, `toDdmParts(value, axis, precision?)`, and `toDmsParts(value, axis, precision?)` take a signed number plus its axis and return the non-negative `degrees`/`minutes`/`seconds` numbers and the `hemisphere` letter (`'N' | 'S' | 'E' | 'W'`), with the `60″ → +1′ → +1°` and `60′ → +1°` carry already applied. `toMgrsParts([lat, lon])` and `toUtmParts([lat, lon])` read the grid fields directly and return a discriminated result — `{ ok: true, value: … }` for in-band coordinates or `{ ok: false, reason: 'out-of-range' }` for latitudes outside the inclusive `80°S`–`84°N` band, and for a longitude of exactly `+180°` (the antimeridian, where the UTM zone is undefined) — so callers can branch on validity without matching thrown error text, and never have to guard against a thrown exception. The result stays total even when `geodesy` itself rejects a coordinate (for example an unpatched `geodesy@2.4.0` at the 84°N edge): that also maps to `{ ok: false }`. The supporting types (`DecimalDegreesParts`, `DdmParts`, `DmsParts`, `MgrsParts`, `UtmParts`, `GridPartsResult`) are exported alongside them.

  `formatMgrsParts(MgrsParts)` and `formatUtmParts(UtmParts)` render grid parts back into their canonical strings, so callers that already hold parts (or want to consume `toMgrsParts`/`toUtmParts` and render without re-deriving the pad/floor/join logic) share one renderer instead of duplicating it. The boolean `isValidNumericCoordinate(lat, lon)` predicate is also exported for callers that need a finite-and-in-range check without the error-message array `validateNumericCoordinate` builds.

  The existing `format*`/`parse*` functions and `createCoordinate(...).mgrs()`/`.utm()` now compose over this parts layer internally; their string output is byte-identical to before.

  Also newly exported, since the parts layer is built from them: `getHemisphere(value, axis)` with the `Axis` and `Hemisphere` types (the typed core behind the existing `getOrdinal`); the grid-band helpers `isWithinGridBand(lat)`, `isOnEasternAntimeridian(lon)`, and `isGridProjectable([lat, lon])` with the `GRID_LATITUDE_MIN` / `GRID_LATITUDE_MAX` bounds; the display-precision defaults `DECIMAL_DEGREES_PRECISION`, `DDM_PRECISION`, and `DMS_PRECISION`; and `formatCoordinateSystem`, the lossless round-trip scaffold the `CoordinateSystem` `toFormat` implementations share (distinct from the display formatters — it applies no rounding or carry).

### Patch Changes

- 747ea86: Export `formatCoordinate` and `normalizeLongitude` from `@accelint/map-toolkit/cursor-coordinates`. `formatCoordinate(lonLat, format)` is the pure formatter behind `useCursorCoordinates` — reach for it to render a DD/DDM/DMS/MGRS/UTM string outside the hook instead of re-deriving the grid-conversion logic.

  Also stop a `RangeError` escaping `formatCoordinate` at the UTM/MGRS latitude boundaries (84°N and 80°S). Both are valid in those systems, but `geodesy@2.4.0` rejected them — 84°N via too-strict northing bounds (widest in the extended Svalbard zones), 80°S via a floating-point error in the latitude-band lookup. Two layers: this monorepo patches `geodesy` (`patches/geodesy@2.4.0.patch`, a workspace-only pnpm patch that does not ship in the published package), and `@accelint/geo`'s grid-parts functions now return `{ ok: false }` instead of throwing whenever geodesy rejects a coordinate — so `formatCoordinate` shows the `--- -- ---- ----` placeholder rather than crashing, even against an unpatched `geodesy`. Coordinates outside the valid band still report `valid: false` as before.

- 9345871: Fix parsing and formatting of coordinate magnitudes below `1e-6°` (within about 11 cm of the equator or prime meridian). JavaScript renders such numbers in exponential notation (`String(0.0000001)` is `'1e-7'`), which the lexer mis-tokenized — the `-7` read as a sign, so `'0.0000001 N / 0 E'` failed with "Bearing (N) conflicts with negative number" — and which `createCoordinate(...).dd()`/`.ddm()`/`.dms()` emitted verbatim. Both paths now use the new `toPlainDecimalString(value)` helper, which renders any number in plain decimal notation; ordinary coordinates are unaffected.

## 0.6.1

### Patch Changes

- a76da93: Fix `formatDegreesDecimalMinutes` and `formatDegreesMinutesSeconds` producing impossible values when rounding rolls over: minutes/seconds that rounded to exactly 60 (e.g. `40.9999995` formatting as `40° 60.0000'`) now carry into the higher unit (`41° 0.0000'`).

## 0.6.0

### Minor Changes

- 58bc0db: Extends `createCoordinate` to accept numeric input formats in addition to strings

## 0.5.1

### Patch Changes

- 45275c4: Fixes bug with Decimal Degrees formatting where ordinal degrees redundantly showed negative numbers

## 0.5.0

### Minor Changes

- 308023f: Increase decimal precision to comply with https://www.jcs.mil/Portals/36/Documents/Library/Instructions/CJCSI%203900.01E.pdf

## 0.4.2

### Patch Changes

- bb73a1e: Ensure dependencies all follow the same semver range across devtk, maptk, and designtk.

## 0.4.1

### Patch Changes

- 34c42a0: Swap bundling to tsdown and auto generate exports entries in package.json.

## 0.4.0

### Minor Changes

- cfe734a: Fix @accelint/geo UTM parsing and formatting. UTM format will no longer return MGRS format.

## 0.3.0

### Minor Changes

- 1788525: Add browser support to the `@accelint/geo` package.
- b32e3ae: Adds formatters to the existing coordinate representations

### Patch Changes

- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.

## 0.2.10

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling
- Updated dependencies [64280a7]
  - @accelint/math@0.1.6
  - @accelint/predicates@0.4.2

## 0.2.9

### Patch Changes

- 5206880: Linting fixes only.
- Updated dependencies [5206880]
  - @accelint/predicates@0.4.1

## 0.2.8

### Patch Changes

- Updated dependencies [383c42a]
  - @accelint/predicates@0.4.0

## 0.2.7

### Patch Changes

- @accelint/predicates@0.3.4

## 0.2.6

### Patch Changes

- 83104ea: Refactored ViewStack to be event driven, allowing for triggers anywhere in the app
- Updated dependencies [83104ea]
  - @accelint/predicates@0.3.3
  - @accelint/math@0.1.5

## 0.2.5

### Patch Changes

- Updated dependencies [ca3922a]
  - @accelint/math@0.1.4
  - @accelint/predicates@0.3.2

## 0.2.4

### Patch Changes

- Updated dependencies [938c74e]
  - @accelint/predicates@0.3.1

## 0.2.3

### Patch Changes

- Updated dependencies [b77d30e]
- Updated dependencies [0fafa9f]
  - @accelint/predicates@0.3.0

## 0.2.2

### Patch Changes

- @accelint/predicates@0.2.2

## 0.2.1

### Patch Changes

- @accelint/predicates@0.2.1

## 0.2.0

### Minor Changes

- 6c23f31: Add coordinate parsing capability; parse string into object with conversion
  options: MGRS, UTM, and lat/lon DD, DDM, DMS. Some error messaging is included
  to be helpful for users and debuggers.

### Patch Changes

- Updated dependencies [4ceec7e]
- Updated dependencies [13f0d6c]
  - @accelint/predicates@0.2.0

## 0.1.3

### Patch Changes

- f117ea6: Converted build step to use `tsup`.
- d39c5d8: Added explicit file extensions to relative path imports via esbuild plugin for tsup.
- Updated dependencies [f117ea6]
- Updated dependencies [d39c5d8]
  - @accelint/converters@0.1.3
  - @accelint/predicates@0.1.3

## 0.1.2

### Patch Changes

- 2c661d3: Standardized package.json "exports" field
- Updated dependencies [2c661d3]
  - @accelint/converters@0.1.2
  - @accelint/predicates@0.1.2

## 0.1.1

### Patch Changes

- 017c16e: Fixed publishing artifacts.
- Updated dependencies [017c16e]
  - @accelint/converters@0.1.1
  - @accelint/predicates@0.1.1

## 0.1.0

### Minor Changes

- eba7ce9: Initial release.

### Patch Changes

- Updated dependencies [eba7ce9]
  - @accelint/converters@0.1.0
  - @accelint/predicates@0.1.0
