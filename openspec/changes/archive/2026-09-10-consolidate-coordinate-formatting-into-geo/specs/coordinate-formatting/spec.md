## ADDED Requirements

### Requirement: Per-axis parts formatters for DD/DDM/DMS

`@accelint/geo` SHALL expose free functions `toDecimalDegreesParts`,
`toDdmParts`, and `toDmsParts` that accept a single signed coordinate value
plus an axis discriminator (`'lat' | 'lon'`) and return a structured,
numeric parts object. These functions SHALL be exported through the
generated barrel (`pnpm index`) with explicit per-file `package.json`
subpaths. They SHALL NOT be methods on `Coordinate`.

Parts objects SHALL carry numbers, not pre-formatted strings:
- `toDecimalDegreesParts` returns `{ degrees, hemisphere }` where `degrees`
  is the non-negative magnitude.
- `toDdmParts` returns `{ degrees, minutes, hemisphere }`.
- `toDmsParts` returns `{ degrees, minutes, seconds, hemisphere }`.

`hemisphere` SHALL be an `'N' | 'S' | 'E' | 'W'` letter following geo's
existing `>= 0` convention (a value of exactly `0` maps to `N` on the lat
axis and `E` on the lon axis). `degrees`, `minutes`, and `seconds` SHALL be
non-negative numbers; the signed value is recoverable via the axis and
hemisphere.

DD/DDM/DMS are defined for all finite lat/lon and SHALL return parts
directly (no out-of-range result). These per-axis functions SHALL NOT
perform range validation; callers pass values already in range.

#### Scenario: DDM parts for a positive latitude

- **GIVEN** the signed latitude `12.5760` and axis `'lat'`
- **WHEN** `toDdmParts(12.5760, 'lat')` is called
- **THEN** it returns `{ degrees: 12, minutes: 34.56, hemisphere: 'N' }`

#### Scenario: DMS parts for a negative longitude

- **GIVEN** the signed longitude `-77.0369` and axis `'lon'`
- **WHEN** `toDmsParts(-77.0369, 'lon')` is called
- **THEN** it returns a parts object with `hemisphere: 'W'` and a
  non-negative `degrees` of `77`

#### Scenario: Zero maps to the positive hemisphere per axis

- **GIVEN** the value `0`
- **WHEN** `toDecimalDegreesParts(0, 'lat')` and
  `toDecimalDegreesParts(0, 'lon')` are called
- **THEN** the latitude result has `hemisphere: 'N'` and the longitude
  result has `hemisphere: 'E'`, each with `degrees: 0`

### Requirement: Carry and precision applied at the parts level

Carry (`60″ → +1′`, `60′ → +1°`) SHALL be applied inside the parts layer
after rounding, exactly matching the current formatter behavior, so that
emitted `minutes` and `seconds` never reach `60`. Default precision
(DD `6`, DDM `4`, DMS `2`) SHALL be applied when carry is computed and
SHALL be exposed as an optional precision argument on the parts functions.
When a precision argument is omitted, the default for that format SHALL be
used.

#### Scenario: Seconds rounding carries into minutes

- **GIVEN** a coordinate whose seconds round to `60.00″` at DMS default
  precision (`2`)
- **WHEN** `toDmsParts(value, axis)` is called
- **THEN** the returned `seconds` is `0` and `minutes` is incremented by `1`
  (and, if minutes reach `60`, `minutes` is `0` and `degrees` is
  incremented by `1`)

#### Scenario: Minutes rounding carries into degrees

- **GIVEN** a coordinate whose minutes round to `60` at DDM default
  precision (`4`)
- **WHEN** `toDdmParts(value, axis)` is called
- **THEN** the returned `minutes` is `0` and `degrees` is incremented by `1`

#### Scenario: Optional precision overrides the default

- **GIVEN** a latitude formatted with a caller-supplied precision that
  differs from the DDM default of `4`
- **WHEN** `toDdmParts(value, 'lat', precision)` is called
- **THEN** carry and rounding are computed at the supplied precision, and
  the emitted `minutes`/`seconds` remain below `60`

### Requirement: Grid parts formatters for MGRS/UTM read geodesy fields directly

`@accelint/geo` SHALL expose free functions `toMgrsParts` and `toUtmParts`
that accept a signed `[lat, lon]` tuple and return the grid parts read
directly from the geodesy `Mgrs`/`Utm` objects, without formatting to a
string and re-parsing it.

- `toMgrsParts` SHALL return `{ zone, band, e100k, n100k, easting, northing }`.
- `toUtmParts` SHALL return `{ zone, hemisphere, easting, northing }`.

`easting` and `northing` SHALL be the rounded integers geodesy yields.
Non-finite input SHALL be rejected via the existing
`validateNumericCoordinate` path used by the grid formatters.

#### Scenario: UTM parts for Washington, D.C.

- **GIVEN** the signed tuple `[38.8977, -77.0365]`
- **WHEN** `toUtmParts([38.8977, -77.0365])` is called
- **THEN** it returns `{ ok: true, value }` where `value` carries a numeric
  `zone`, a `hemisphere`, and integer `easting`/`northing`

#### Scenario: MGRS parts expose the grid-square identifiers

- **GIVEN** a valid in-band `[lat, lon]` tuple
- **WHEN** `toMgrsParts([lat, lon])` is called
- **THEN** it returns `{ ok: true, value }` where `value` carries `zone`,
  `band`, `e100k`, `n100k`, and integer `easting`/`northing`

### Requirement: Discriminated out-of-range result for grid formatters

`toMgrsParts` and `toUtmParts` SHALL return a discriminated union
`{ ok: true, value } | { ok: false, reason: 'out-of-range' }`. They SHALL
NOT throw and SHALL NOT return an empty string to signal out-of-range.
This no-throw guarantee SHALL hold for every input, including a longitude of
exactly `+180°`, where the underlying UTM zone is undefined; it SHALL be
reported as `{ ok: false, reason: 'out-of-range' }` rather than propagating
the geodesy exception. DD/DDM/DMS parts functions SHALL NOT use this union —
they return parts directly.

#### Scenario: Latitude beyond the UTM/MGRS band returns out-of-range

- **GIVEN** the signed tuple `[85, 10]` (latitude north of `84°N`)
- **WHEN** `toUtmParts([85, 10])` is called
- **THEN** it returns `{ ok: false, reason: 'out-of-range' }` and does not
  throw

#### Scenario: Consumers branch on the typed field, not error text

- **GIVEN** a grid parts result
- **WHEN** a consumer inspects the result
- **THEN** it distinguishes success from failure by reading `ok` rather than
  string-matching geodesy error messages such as `'outside UTM limits'`

#### Scenario: The +180° antimeridian is out-of-range, not a thrown error

- **GIVEN** the signed tuple `[0, 180]` (longitude on the eastern
  antimeridian, where the UTM zone is undefined)
- **WHEN** `toUtmParts([0, 180])` and `toMgrsParts([0, 180])` are called
- **THEN** each returns `{ ok: false, reason: 'out-of-range' }` and neither
  throws, while `[0, -180]` and longitudes just short of `+180°` still return
  `{ ok: true, value }`

### Requirement: 80°S–84°N inclusive boundary checked once in geo

The grid parts functions SHALL treat `-80 ≤ lat ≤ 84` as valid, inclusive
at both edges, matching the patched geodesy range. This boundary SHALL be
the single definition; consumers SHALL NOT keep their own stricter guards.

#### Scenario: Both band edges are inclusive

- **GIVEN** the boundary latitudes `-80` (80°S) and `84` (84°N) with a valid
  longitude
- **WHEN** `toUtmParts([-80, lon])` and `toUtmParts([84, lon])` are called
- **THEN** both return `{ ok: true, value }`

#### Scenario: Just outside the south edge is out-of-range

- **GIVEN** a latitude just below `-80` (e.g. `-80.0001`)
- **WHEN** `toUtmParts([-80.0001, lon])` is called
- **THEN** it returns `{ ok: false, reason: 'out-of-range' }`

### Requirement: String formatters compose over the parts layer

The existing string formatters (`formatDecimalDegrees`,
`formatDegreesDecimalMinutes`, `formatDegreesMinutesSeconds`, and the
`Coordinate` `mgrs()`/`utm()` renderers) SHALL be refactored to compose over
the parts layer: they call the parts function, then render each part
(`degrees` + `°`, `minutes` + `'`, `seconds` + `″` (U+2033), plus the
hemisphere letter). Carry logic SHALL live only in the parts layer. String
formatters SHALL pass the current default precisions so their output is
preserved.

Output SHALL remain byte-for-byte identical to the pre-refactor formatters
for all coordinates, including `0`, negative values, and the `80°S`/`84°N`
boundaries. The public signatures of `format*`/`parse*` SHALL NOT change.
This addition SHALL be a MINOR (additive, non-breaking) change to
`@accelint/geo`.

#### Scenario: String and parts output cannot diverge

- **GIVEN** the same signed coordinate and format
- **WHEN** both the string formatter and the parts function are evaluated
- **THEN** the rendered string is exactly the string built from the parts
  object (same degrees/minutes/seconds values, `″` glyph, and hemisphere)

#### Scenario: Byte-identical output preserved after refactor

- **GIVEN** the regression table of DD/DDM/DMS/MGRS/UTM strings for a spread
  of coordinates including `0`, negatives, and the `80°S`/`84°N` boundaries
- **WHEN** the refactored formatters produce those strings
- **THEN** every string matches its pre-refactor value byte-for-byte

### Requirement: Consumers migrate onto the parts layer

`@accelint/map-toolkit` (`cursor-coordinates/format-coordinate.ts`) SHALL
consume the grid parts path directly instead of round-tripping MGRS/UTM
through `createCoordinate(...)` string parsing, and SHALL drop its stricter
`lat < -80` guard, deferring to the discriminated out-of-range result. Each
consumer SHALL keep its own out-of-range sentinel (map-toolkit's
`--- -- ---- ----`; design-toolkit's own sentinel); only the detection moves
to the discriminated result, with no user-visible string change.

`@accelint/design-toolkit` (`components/coordinate-field/coordinate-utils.ts`)
SHALL rewire the internals of `parseCoordinateStringToSegments`,
`convertDDToDisplaySegments`, and `getAllCoordinateFormats` to consume geo
parts, and SHALL delete the private regex parse-back helpers
(`parseDD/DDM/DMS/MGRS/UTMCoordinateString`). Those three functions are
public (barrel-exported and available via a public subpath), so their
signatures AND output shape SHALL be preserved unchanged; only their
internals rewire. The segment value arrays and their ordering SHALL be
unchanged (DD `[lat, lon]`; DDM `[latDeg, latMin, latDir, lonDeg, lonMin,
lonDir]`; DMS `[latDeg, latMin, latSec, latDir, …]`; MGRS `[zone, band,
grid, easting, northing]`; UTM `[zone, hemisphere, easting, northing]`), so
react-aria field wiring, focus order, and screen-reader labels are
unaffected.

#### Scenario: map-toolkit formats MGRS via grid parts

- **GIVEN** an in-band cursor position as a signed `[lat, lon]`
- **WHEN** `formatCoordinate` renders MGRS/UTM
- **THEN** it uses `toMgrsParts`/`toUtmParts` (no intermediate string +
  regex round-trip) and produces the same joined string as before

#### Scenario: map-toolkit emits its sentinel out of range

- **GIVEN** a cursor latitude outside `80°S–84°N`
- **WHEN** `formatCoordinate` renders MGRS/UTM
- **THEN** the grid parts result is `{ ok: false, reason: 'out-of-range' }`
  and map-toolkit emits its `--- -- ---- ----` sentinel

#### Scenario: design-toolkit public functions keep signature and output

- **GIVEN** the same input passed to `convertDDToDisplaySegments`,
  `parseCoordinateStringToSegments`, and `getAllCoordinateFormats` before and
  after the migration
- **WHEN** each function is called
- **THEN** its return value is identical in shape and content, and the
  private `parse*CoordinateString` helpers no longer exist

### Requirement: Signed input contract; no longitude normalization added

The parts functions SHALL accept finite signed numbers (per-axis) or a
signed `[lat, lon]` tuple (grid). This change SHALL NOT add longitude
normalization to `@accelint/geo`; `normalizeLongitude` SHALL remain in
`@accelint/map-toolkit`. Bearing/azimuth (compass) formatting is out of
scope.

#### Scenario: No normalization is applied to longitude input

- **GIVEN** a longitude already outside `[-180, 180)` such as `190`
- **WHEN** a parts function is called
- **THEN** geo does not wrap or normalize the value; normalization remains
  the caller's responsibility via map-toolkit's `normalizeLongitude`
