---
change: consolidate-coordinate-formatting-into-geo
specs_touched: [coordinate-formatting]
decisions:
  - id: D1
    choice: Add free parts-returning functions (toDecimalDegreesParts/toDdmParts/toDmsParts/toMgrsParts/toUtmParts), not Coordinate methods
    rationale: Matches geo's existing free-function surface and tree-shaking; module-private per-value converters become the shared core, so no passthrough wrapper
    alternatives: [methods-on-Coordinate]
  - id: D2
    choice: Existing string formatters compose over the parts layer (carry math lives once)
    rationale: Eliminates string/parts divergence risk; guarded by a byte-identical regression table
    alternatives: [keep-formatters-independent]
  - id: D3
    choice: Numeric parts (degrees/minutes/seconds as numbers + hemisphere letter); precision owned by the renderer; carry applied at part level
    rationale: Numbers let each consumer format to its own precision without re-parsing; carry-at-part keeps every emitted part in-range
    alternatives: [pre-formatted-strings, signed-only-no-hemisphere]
  - id: D4
    choice: Discriminated result ({ok:true,value}|{ok:false,reason}) for MGRS/UTM out-of-range
    rationale: Consumers branch on a typed field instead of string-matching geodesy error text
    alternatives: [throw, return-empty-string]
  - id: D5
    choice: 80°S–84°N inclusive boundary checked once in geo; map-toolkit drops its stricter guard
    rationale: One boundary definition; removes the south-edge disagreement between the three consumers
    alternatives: [keep-guard-per-consumer]
  - id: D6
    choice: Signed [lat,lon] input contract; no longitude normalization added (deferred to a separate @accelint/math wrap primitive)
    rationale: normalizeLongitude is angle-wrap math, not coordinate formatting; belongs beside clamp() in @accelint/math
    alternatives: [normalize-in-geo]
---

## Context

`@accelint/geo` (0.6.1) formats coordinates as strings with no structured
intermediate. String formatters compute directly, so any consumer needing
per-axis parts must re-parse geo's own output.

Current state — key files:
- `coordinates/latlon/internal/format.ts` — `createFormatter` destructures
  `[lat,lon]`, calls a per-axis converter, appends `getOrdinal`, joins.
- Per-value converters `toDecimalDegrees` / `toDegreesDecimalMinutes` /
  `toDegreesMinutesSeconds` are **module-private**. Precision is hard-coded
  (`toFixed(6)` DD, `toFixed(4)` DDM min, `toFixed(2)` DMS sec). Carry
  (60″→+1′→+1°, 60′→+1°) runs **after** rounding; DD has no carry.
- `getOrdinal` (internal/ordinal.ts): `>= 0` → N/E (0 maps to N/E).
- `coordinates/utm/system.ts` **already reads** geodesy `Utm` fields
  (`zone.padStart(2,'0')`, `hemisphere`, `Math.round(easting/northing)`) →
  `"31N 448251 5411932"`. `coordinates/mgrs/system.ts` does **not** — it
  calls `.toMgrs().toString()` and discards `{zone,band,e100k,n100k,
  easting,northing}`.
- Public barrel `src/index.ts` is generated (`pnpm index`); exports are
  explicit per-file subpaths. DMS emits `″` (U+2033).

Consumer duplication:
- `design-toolkit/coordinate-utils.ts` `convertDDToDisplaySegments` is
  circular: DD → string → geo parse → format → **regex parse-back**
  (`parseDD/DDM/DMS/MGRS/UTMCoordinateString`) → segments, with
  `coord.raw.LAT/LON` re-injected to restore precision. Its docstring
  already names a hypothetical `coord.components.ddm`. The reverse
  (`convertDisplaySegmentsToDD`, Segments→String→parse→read `coord.raw`) is
  efficient and stays.
- `map-toolkit/format-coordinate.ts` round-trips MGRS/UTM through
  `createCoordinate(...)('lon E / lat N')` string parsing; owns
  `normalizeLongitude`; guards `lat < -80 || lat > 84` (stricter at the
  south edge than geo).

Boundary: `patches/geodesy@2.4.0.patch` makes UTM/MGRS valid range
**80°S–84°N inclusive**. Out-of-range signaling today: map-toolkit returns
a `--- -- ---- ----` constant; design-toolkit string-matches geodesy
`'outside UTM limits'`/`'invalid UTM zone'`.

## Goals / Non-Goals

**Goals:**
- Expose structured, per-parts formatters in geo (single source of the
  parts every consumer re-derives).
- Refactor existing string formatters to **compose over** parts so
  string/parts output cannot diverge; carry lives in one place.
- Read geodesy `Mgrs`/`Utm` fields directly; delete design-toolkit's regex
  parse-back layer.
- Additive, non-breaking public API (MINOR bump); preserve byte-for-byte
  output of existing `format*`.

**Non-Goals:**
- Bearing/azimuth (compass) formatting — not in geo.
- Migrating `neo-for-iamd` (separate repo); API must merely enable it.
- Relocating `normalizeLongitude`. It is angle-wrap math, not coordinate
  formatting, and belongs in `@accelint/math` (which already exports the
  sibling `clamp(min,max,value)`) as a general `wrap(min,max,value)`
  primitive — serving `normalizeLongitude` (`[-180,180)`), shape rotation in
  `edit-shape-layer/modes/utils/orientation-lock.ts` (`[0,360)`), and neo's
  `asBearing`. Deferred to a separate `@accelint/math` change.
- Changing existing free `format*`/`parse*` signatures or output.

## Decisions

**Decision 1 — Standalone functions returning parts, not methods.**
- Choice: add free `toDecimalDegreesParts(latOrLon, axis)` etc. and
  grid `toMgrsParts([lat,lon])` / `toUtmParts([lat,lon])`,
  exported through the generated barrel. Per-axis DD/DDM/DMS operate on a
  single signed number + axis discriminator; grid operates on the tuple.
- Rationale: matches geo's existing free-function surface and tree-shaking;
  `Coordinate` methods would couple parts to the object lifecycle. The
  existing module-private per-value converters become the shared core these
  wrap, so there is no passthrough wrapper — the string formatter and the
  parts formatter both call the same converter.
- Alternatives: methods on `Coordinate` (rejected — heavier surface,
  worse tree-shaking, out of step with `format*`).

**Decision 2 — String formatters compose over parts.**
- Choice: `createFormatter`'s per-axis step calls the parts function,
  then renders (degrees + `°`, minutes + `'`, seconds + `″`, hemisphere).
  Carry moves entirely into the parts layer.
- Rationale: eliminates divergence risk; carry defined once. Output must
  stay byte-identical — covered by a regression table (Risk 1).
- Alternatives: keep formatters independent (rejected — the divergence
  this change exists to remove).

**Decision 3 — Numeric parts; precision owned by the renderer.**
- Choice: parts objects carry **numbers** (`degrees`, `minutes`,
  `seconds` as numbers; `hemisphere` as an `'N'|'S'|'E'|'W'` letter, matching
  geo's existing `>= 0` convention). MGRS/UTM `easting`/`northing` are the
  rounded integers geodesy yields. Carry is applied at the parts level so
  parts are always in-range (`minutes`/`seconds` never reach 60). Default
  precision (DD 6 / DDM 4 / DMS 2) is applied when carry is computed and is
  exposed as an optional argument; string formatters pass the current
  defaults to preserve output.
- Rationale: numbers let each consumer format to its own precision (neo,
  design-toolkit fields) without re-parsing; carry-at-part keeps every
  emitted part valid regardless of precision. Also exposes signed DD via the
  existing `coord.raw` — no new signed accessor needed.
- Alternatives: pre-formatted strings (rejected — forces geo's precision on
  every consumer, the exact coupling we remove); expose signed only, no
  hemisphere (rejected — design-toolkit needs the letter for its DDM/DMS
  direction segments).

**Decision 4 — Discriminated out-of-range result for grid formatters.**
- Choice: `toMgrsParts`/`toUtmParts` return a discriminated union
  `{ ok: true, value } | { ok: false, reason: 'out-of-range' }` rather than
  throwing or returning `''`. DD/DDM/DMS never go out of range (defined for
  all finite lat/lon) and keep returning parts directly.
- Rationale: lets map-toolkit and design-toolkit branch on a typed field
  instead of string-matching geodesy error text; the 80°S–84°N boundary is
  checked in geo once. Consumers map `ok: false` to their own sentinel
  (`--- -- ---- ----`, `'Not available at poles'`).
- Alternatives: throw (rejected — forces try/catch in per-render paths,
  which the perf guidance discourages); return `''`/zero value (rejected —
  indistinguishable from a valid empty edge, and drops the reason).

**Decision 5 — Boundary 80°S–84°N inclusive, checked in geo.**
- Choice: the grid parts functions treat `-80 ≤ lat ≤ 84` as valid
  (inclusive both edges), matching the patched geodesy and geo's boundary
  tests. map-toolkit drops its stricter `lat < -80` guard and defers to the
  discriminated result.
- Rationale: one boundary definition; removes the south-edge disagreement.
- Alternatives: keep the guard in each consumer (rejected — three copies
  that already disagree).

**Decision 6 — Input contract: signed numbers / `[lat,lon]` tuple; no
normalization added.** Parts functions accept finite signed numbers;
non-finite input is rejected via the existing `validateNumericCoordinate`
path used by grid formatters (DD/DDM/DMS free formatters do no validation
today and that stays for the per-axis parts fn — consumers pass values
already in range). `normalizeLongitude` stays in map-toolkit.

## Data flow

```
BEFORE (design-toolkit convertDDToDisplaySegments):
  DD --> geo string --> geo parse --> coord.format() --> REGEX parse-back --> segments
                                                          ^ re-inject coord.raw for precision

AFTER:
  DD --> geo toDdmParts(lat) / (lon) --> { degrees, minutes, hemisphere } --> segments
  (regex parse-back layer deleted)

geo internal (single source):
  signed number --+--> [parts fn] --carry+precision--> { degrees, minutes?, seconds?, hemisphere }
                  |                                              |
                  +--> [string formatter] --render °/'/″-------> "12°34.5678' N"   (composes over ^)
```

## Risks / Trade-offs

- **[Byte-identical drift]** Refactoring string formatters to compose could
  change output (rounding order, `″` glyph, ordinal at 0). → Add a
  regression table asserting current DD/DDM/DMS/MGRS/UTM strings for a
  spread of coords incl. 0, negatives, and 80°S/84°N before refactoring;
  the refactor must keep it green.
- **[Carry after precision]** Carry must run after `toFixed` (60.00″
  rounding) exactly as today, now at the parts level. → Port the
  existing carry blocks verbatim; test 59.999″-type carry cases per system.
- **[Boundary off-by-one]** Inclusive `-80`/`84` must match geodesy after
  the patch. → Reuse the existing 84°N/80°S boundary table added on this
  branch; assert `ok: true` at both edges.
- **[design-toolkit public-API bump]** `coordinate-utils.ts` is a public
  subpath export, and `parseCoordinateStringToSegments`,
  `convertDDToDisplaySegments`, and `getAllCoordinateFormats` are all
  re-exported from design-toolkit's barrel (`index.ts`). Only the *private*
  `parseDD/DDM/DMS/MGRS/UTMCoordinateString` helpers may be deleted. Those
  three public functions must keep their signatures **and** output shape —
  the migration rewires their internals to consume geo parts, nothing more.
  → PATCH holds only under that constraint; a signature/output change would
  be MINOR/MAJOR. Assert it with the existing coordinate-utils tests.
- **[Consumer sentinel skew]** design-toolkit/map-toolkit currently emit
  different out-of-range sentinels. → Keep each consumer's sentinel; only
  the *detection* moves to the discriminated result. No user-visible string
  change.
- **[design-toolkit accessibility]** The migration only changes how segment
  values are computed, not the editable-field structure, roles, labels, or
  keyboard model — the segment arrays (`[latDeg,latMin,latDir,…]`) and
  their ordering in `segment-configs.ts` are unchanged, so react-aria field
  wiring, focus order, and screen-reader labels are unaffected. Verify with
  the existing coordinate-input stories/tests.
- **[map-toolkit hot path]** `formatCoordinate` runs on cursor move.
  Parts functions do the same arithmetic as today with **fewer**
  allocations (no intermediate string + regex round-trip for MGRS/UTM), so
  this is neutral-to-better against the 16.67ms budget; no per-frame array
  reuse concerns since output is a small fixed-shape object. No new work in
  deck.gl accessors.

## Storybook

- design-toolkit coordinate-input stories demonstrate DD/DDM/DMS/MGRS/UTM
  segment editing still renders identically post-migration.
- geo has no Storybook; the `*.docs.mdx` for the new formatters (if geo
  gains one) plus the regression test table are the reference surface.

## Open Questions

No unresolved questions. `normalizeLongitude` relocation is deferred to a
separate `@accelint/math` `wrap` change (see Non-Goals), not left open;
precision, boundary, out-of-range signaling, and API shape are all resolved
above.
