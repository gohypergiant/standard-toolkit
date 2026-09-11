## Why

Coordinate string formatting is duplicated and lossy across the monorepo.
`@accelint/geo` computes DD/DDM/DMS/MGRS/UTM strings directly with no
structured intermediate, so consumers that need per-axis parts must
re-parse geo's output. `design-toolkit` reconstructs editable field
segments through a circular path (DD → string → geo parse → format →
**regex parse-back** → segments, with `coord.raw` re-injection to recover
lost precision); `map-toolkit` round-trips MGRS/UTM through
`createCoordinate(...)('lon E / lat N')` string parsing. Both re-derive
structure geo already has internally, and out-of-range handling relies on
**string-matching geodesy error messages**. Exposing a parts layer in
geo removes the duplication at its source.

## What Changes

- Add parts-returning formatters to `@accelint/geo` public API:
  - DD/DDM/DMS return per-axis parts `{ degrees, minutes?, seconds?, hemisphere }`.
  - MGRS returns `{ zone, band, e100k, n100k, easting, northing }` and UTM
    returns `{ zone, hemisphere, easting, northing }`, read from the
    geodesy `Mgrs`/`Utm` objects directly instead of format-then-regex.
- Refactor the existing string formatters to **compose over** the new
  parts layer so string and parts output cannot diverge (carry
  logic 60″→+1′→+1° and 60′→+1° lives in one place).
- Decide and document precision ownership (numeric parts vs.
  pre-formatted strings; default DD 6dp / DDM 4dp / DMS 2dp).
- Introduce a discriminated out-of-range result so consumers stop
  string-matching geodesy errors; honor the patched **80°S–84°N inclusive**
  UTM/MGRS band boundary.
- Migrate `map-toolkit` to the cleaner MGRS/UTM tuple path and
  `design-toolkit` to consume parts directly, **deleting** its regex
  parse-back layer (`parseDD/DDM/DMS/MGRS/UTMCoordinateString`).

Not breaking: existing free `format*`/`parse*` exports keep their
signatures and byte-for-byte output. Change is **additive**.

## Capabilities

### New Capabilities
- `coordinate-formatting`: Structured, per-part coordinate formatting
  (DD/DDM/DMS/MGRS/UTM) in `@accelint/geo` — the parts data model,
  carry/precision rules, boundary handling, and out-of-range signaling that
  string formatters compose over.

### Modified Capabilities
<!-- None. openspec/specs/ has only `coordinate-grid-layers` (deck.gl grid
     RENDERING in map-toolkit); no existing spec governs geo string
     formatting, so this introduces a new capability rather than modifying one. -->

## Impact

- **Packages touched**: `@accelint/geo` (new public API + refactor of
  existing formatters), `@accelint/map-toolkit` (consume MGRS/UTM path),
  `@accelint/design-toolkit` (consume parts, delete regex parse-back).
- **Downstream (in-repo)**: map-toolkit and design-toolkit consume geo;
  both migrated here.
- **Out of scope**: `neo-for-iamd` (separate repo — not migrated, but the
  API is designed to let it drop its temporary `format.ts`);
  bearing/azimuth (compass) formatting; changing existing free
  `format*`/`parse*` signatures or output; `normalizeLongitude` relocation
  (evaluate but not required).
- **API surface**: geo is 0.6.1 (pre-1.0). Additive public API →
  **MINOR** changeset for `@accelint/geo`. Consumers are **PATCH** —
  *conditional on* preserving the signatures and output of design-toolkit's
  publicly-exported `parseCoordinateStringToSegments` /
  `convertDDToDisplaySegments` / `getAllCoordinateFormats` (only the private
  `parse*CoordinateString` helpers are deleted). No breaking change.
