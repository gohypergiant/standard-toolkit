## Why

The `coordinate-formatting` spec was archived before two fixes landed in
`@accelint/geo`, so one behavior the package now guarantees is missing from
its requirements. JavaScript renders any number below `1e-6` in exponential
notation (`String(0.0000001)` is `'1e-7'`). The coordinate lexer normalized
numeric tokens through that conversion, so a coordinate within ~11 cm of the
equator or prime meridian mis-tokenized (`-7` read as a sign), and the lossless
round-trip renderers (`createCoordinate(...).dd()`/`.ddm()`/`.dms()`) emitted
`1e-7` verbatim. Without a requirement, the fix reads as dead weight to a
future reader: `${Number.parseFloat(num)}` is the "simpler" line and would
reintroduce the defect.

## What Changes

- Add one requirement to `coordinate-formatting`: numeric magnitudes SHALL be
  rendered in plain decimal notation by the lexer and the round-trip
  renderers, via the single exported `toPlainDecimalString(value)` helper,
  which expands only negative exponents and leaves other values as JavaScript
  renders them.

No code changes: this documents behavior already implemented and tested
(`packages/geo/src/coordinates/latlon/internal/plain-decimal.ts` and its
tests, plus the "magnitudes below 1e-6" suite in `packages/geo/src/index.test.ts`).

## Capabilities

### Modified Capabilities
- `coordinate-formatting`: adds the plain-decimal-notation requirement.

## Impact

- **Packages touched**: none (spec only).
- **API surface**: none — `toPlainDecimalString` is already published (`@accelint/geo` patch changeset `geo-plain-decimal-notation`).
