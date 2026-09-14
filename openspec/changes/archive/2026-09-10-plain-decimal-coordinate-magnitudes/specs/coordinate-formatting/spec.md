## ADDED Requirements

### Requirement: Magnitudes render and parse in plain decimal notation

The coordinate lexer and the lossless round-trip renderers
(`createCoordinate(...).dd()`, `.ddm()`, `.dms()`) SHALL render numeric
magnitudes in plain decimal notation, never JavaScript exponential notation,
so that values below `1e-6` (where `String(0.0000001)` is `'1e-7'`) neither
mis-tokenize on parse nor appear in formatted output. `@accelint/geo` SHALL
export a single helper, `toPlainDecimalString(value)`, that both paths use.
It SHALL expand only negative exponents (to at most 20 fraction digits, with
trailing zeros trimmed) and SHALL return every other value exactly as
JavaScript renders it. Parser precision caps (e.g. DD's 10 decimal places)
are unchanged by this requirement.

#### Scenario: A sub-1e-6 coordinate string parses

- **GIVEN** the DD string `'0.0000001 N / 0 E'`
- **WHEN** it is parsed with `createCoordinate(coordinateSystems.dd, 'LATLON')`
- **THEN** the result is valid with `raw` equal to `{ LAT: 0.0000001, LON: 0 }`
  and no error such as "Bearing (N) conflicts with negative number (1e-7)"

#### Scenario: Round-trip renderers emit plain notation

- **GIVEN** the numeric tuple `[0.0000001, -0.0000005]`
- **WHEN** `.dd()`, `.ddm()`, and `.dms()` are called on the coordinate
- **THEN** the outputs are `'0.0000001 N / 0.0000005 W'`,
  `'0 0.000006 N / 0 0.00003 W'`, and `'0 0 0.00036 N / 0 0 0.0018 W'`,
  and each re-parses with its own system to the original values

#### Scenario: Large magnitudes are left as JavaScript renders them

- **GIVEN** the value `1e30`
- **WHEN** `toPlainDecimalString(1e30)` is called
- **THEN** it returns `'1e+30'` unchanged rather than a truncated string
