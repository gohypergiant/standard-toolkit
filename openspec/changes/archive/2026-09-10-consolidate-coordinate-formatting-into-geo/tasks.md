## 1. geo DD/DDM/DMS parts layer + string formatters compose over it [PKG:geo]

**Slice goal**: signed number + axis in, per-axis parts out; the existing
DD/DDM/DMS string formatters render over those parts with byte-identical
output. No consumer changes yet. This slice is a prerequisite for slices 3
and 4.

- [x] 1.1 Add a byte-identical regression table (before touching production
      code): assert current `formatDecimalDegrees` /
      `formatDegreesDecimalMinutes` / `formatDegreesMinutesSeconds` strings
      for a spread of coordinates including `0`, negatives, a `59.999″`-type
      seconds-carry case, a minutes-carry case, and the `80°S` / `84°N`
      latitudes. Confirm it passes against the unrefactored code.
- [x] 1.2 Add free `toDecimalDegreesParts(value, axis, precision?)`,
      `toDdmParts(value, axis, precision?)`, `toDmsParts(value, axis,
      precision?)` in the `coordinates/latlon/{decimal-degrees,
      degrees-decimal-minutes,degrees-minutes-seconds}/formatter.ts`
      modules. Return numeric parts (`degrees` / `minutes` / `seconds` as
      non-negative numbers; `hemisphere` as `'N'|'S'|'E'|'W'` via the
      existing `getOrdinal` `>= 0` convention). Move carry
      (`60″→+1′→+1°`, `60′→+1°`) and default precision (DD 6 / DDM 4 /
      DMS 2) into these functions; port the existing carry blocks verbatim.
      No re-exports across module boundaries; export at the declaration site.
- [x] 1.3 Refactor the private per-value converters
      (`toDecimalDegrees`/`toDegreesDecimalMinutes`/`toDegreesMinutesSeconds`)
      + `createFormatter`'s per-axis step so the string formatters compose
      over the parts functions (render `degrees`+`°`, `minutes`+`'`,
      `seconds`+`″` U+2033, hemisphere). String formatters pass the current
      default precisions. Carry must exist only in the parts layer.
- [x] 1.4 Add unit tests for the parts functions: positive/negative lat and
      lon, `0` → `N`/`E`, seconds-carry into minutes, minutes-carry into
      degrees, and an explicit precision override keeping minutes/seconds
      below `60`.
- [x] 1.5 Run `pnpm index` in geo (do NOT hand-edit `src/index.ts`) and add
      the explicit per-file `package.json` subpath exports for the new
      public files.

**Test:** `pnpm --filter @accelint/geo test` — the 1.1 regression table is
byte-identical green after the 1.3 refactor, and the 1.4 parts tests pass.
`pnpm --filter @accelint/geo tsc --noEmit` clean (geo has a single
tsconfig). Depends on: nothing.

## 2. geo MGRS/UTM grid parts + discriminated result + inclusive boundary [PKG:geo]

**Slice goal**: signed `[lat,lon]` tuple in; grid parts read directly from
geodesy `Mgrs`/`Utm`; out-of-range signaled by a discriminated union; the
`80°S–84°N` inclusive boundary checked once in geo. Prerequisite for slices
3 and 4.

- [x] 2.1 Add `toUtmParts([lat,lon])` returning `{ ok:true, value:{ zone,
      hemisphere, easting, northing } } | { ok:false, reason:'out-of-range'
      }`, reading geodesy `Utm` fields directly
      (`coordinates/utm/system.ts` already reads them). `easting`/`northing`
      are the rounded integers geodesy yields. Reject non-finite input via
      the existing `validateNumericCoordinate` path.
- [x] 2.2 Add `toMgrsParts([lat,lon])` returning the same discriminated
      shape with `value:{ zone, band, e100k, n100k, easting, northing }`,
      reading the geodesy `Mgrs` object directly instead of
      `.toMgrs().toString()` + discard (`coordinates/mgrs/system.ts`
      currently discards these fields).
- [x] 2.3 Refactor `Coordinate` `utm()` / `mgrs()` string renderers to
      compose over `toUtmParts` / `toMgrsParts`, preserving byte-identical
      output (extend the 1.1 regression table with MGRS/UTM rows for a
      spread of coords incl. the boundary latitudes).
- [x] 2.4 Check the `-80 ≤ lat ≤ 84` inclusive boundary once in the grid
      parts functions. Reuse the existing 84°N/80°S boundary table in
      `packages/geo/src/index.test.ts`; assert `ok:true` at both edges and
      `ok:false, reason:'out-of-range'` just past `-80` (e.g. `-80.0001`)
      and past `84`.
- [x] 2.5 Run `pnpm index` in geo and add per-file `package.json` subpath
      exports for the new grid-parts public files.

**Test:** `pnpm --filter @accelint/geo test` — grid parts return correct
`ok:true` values for in-band coords (e.g. UTM for `[38.8977,-77.0365]`),
`ok:false` past both edges, both edges inclusive, and the extended
regression table stays byte-identical. Depends on: task 1 (shared parts
conventions / barrel / `getOrdinal`).

## 3. Migrate map-toolkit onto the grid parts path [PKG:map-toolkit]

**Slice goal**: `cursor-coordinates/format-coordinate.ts` renders MGRS/UTM
via `toMgrsParts`/`toUtmParts` (no `createCoordinate(...)` string
round-trip), drops the stricter `lat < -80` guard, and branches on the
discriminated result while keeping its `--- -- ---- ----` sentinel.

- [x] 3.1 Replace the MGRS/UTM string round-trip in `formatCoordinate` with
      direct `toMgrsParts`/`toUtmParts` calls, joining the returned parts
      into the same output strings as before. Keep `normalizeLongitude`
      in map-toolkit (do not relocate).
- [x] 3.2 Delete the stricter `lat < -80 || lat > 84` guard; on
      `{ ok:false, reason:'out-of-range' }` emit the existing
      `--- -- ---- ----` sentinel. No user-visible string change.
- [x] 3.3 Update `format-coordinate.test.ts`: keep the existing boundary
      tests but assert the new south-edge behavior (`-80` inclusive now
      valid), and that in-band MGRS/UTM strings are unchanged.

**Test:** `pnpm --filter @accelint/map-toolkit test` green;
`pnpm --filter @accelint/map-toolkit tsc --noEmit -p tsconfig.dist.json` and
`-p tsconfig.dev.json` clean. In-band MGRS/UTM output identical to
pre-migration; out-of-range still emits the sentinel; `-80` is now valid.
Depends on: tasks 1 and 2. Independent of task 4.

## 4. Migrate design-toolkit onto geo parts; delete regex parse-back [PKG:design-toolkit]

**Slice goal**: `components/coordinate-field/coordinate-utils.ts` computes
segment values from geo parts and deletes the private
`parseDD/DDM/DMS/MGRS/UTMCoordinateString` helpers, while
`parseCoordinateStringToSegments`, `convertDDToDisplaySegments`, and
`getAllCoordinateFormats` keep their public signatures AND output shape.

- [x] 4.1 Rewire `convertDDToDisplaySegments` to build DD/DDM/DMS segments
      from `toDecimalDegreesParts`/`toDdmParts`/`toDmsParts` per axis
      (hemisphere letter drives the direction segment), replacing the
      DD→string→parse→format→regex parse-back path. Preserve the flat
      segment value arrays and ordering (DD `[lat,lon]`; DDM
      `[latDeg,latMin,latDir,lonDeg,lonMin,lonDir]`; DMS
      `[latDeg,latMin,latSec,latDir,…]`).
- [x] 4.2 Rewire MGRS/UTM segment building to `toMgrsParts`/`toUtmParts`
      (MGRS `[zone,band,grid,easting,northing]`; UTM
      `[zone,hemisphere,easting,northing]`), branching on the discriminated
      result and mapping `ok:false` to design-toolkit's existing sentinel
      (drop the geodesy error-text string-matching).
- [x] 4.3 Delete the private `parseDD/DDM/DMS/MGRS/UTMCoordinateString`
      helpers only. Do NOT change `parseCoordinateStringToSegments`,
      `convertDDToDisplaySegments`, or `getAllCoordinateFormats` signatures
      or output shape (they are barrel-exported + public subpath).
- [x] 4.4 Confirm `coordinate-utils.test.ts`,
      `coordinate-field.test.tsx`, and `coordinate-field-integration.test.tsx`
      pass unchanged (signature/output preserved); add coverage asserting the
      three public functions' output is identical pre/post migration and that
      segment arrays/ordering are unchanged. Verify the coordinate-input
      Storybook stories still render identically.

**Test:** `pnpm --filter @accelint/design-toolkit test` green (incl. the
integration tests); `tsc --noEmit -p tsconfig.dist.json` and
`-p tsconfig.dev.json` clean. Public functions unchanged in shape/output;
private helpers gone; segment arrays/ordering and react-aria field wiring
unaffected. Depends on: tasks 1 and 2. Independent of task 3.

## 5. Verification gate + changesets [PKG:geo] [PKG:map-toolkit] [PKG:design-toolkit]

- [x] 5.1 Run the full gate at the repo root: `pnpm run build`, then
      `pnpm run test`, `pnpm run lint`, `pnpm run format`. Fix any failures.
- [x] 5.2 Create changesets: `@accelint/geo` MINOR (additive public API +
      internal refactor, byte-identical output); `@accelint/map-toolkit`
      PATCH; `@accelint/design-toolkit` PATCH (conditional on the public
      `parseCoordinateStringToSegments`/`convertDDToDisplaySegments`/
      `getAllCoordinateFormats` signatures + output being preserved — only
      private helpers deleted). Describe user-facing changes clearly.

**Test:** all four gate commands pass at the repo root and the changesets
exist with correct bump levels. Depends on: tasks 1–4.

## Parallelization Strategy

### Dependencies (Must Complete First)

- **Task 2** must wait until **Task 1** completes — it reuses the parts
  conventions, `getOrdinal`, barrel wiring, and byte-identical regression
  table established in Task 1.
- **Tasks 3 and 4** must both wait until **Tasks 1 and 2** complete — they
  consume the geo parts API (DD/DDM/DMS from Task 1, MGRS/UTM discriminated
  result from Task 2).
- **Task 5** must wait until **Tasks 1–4** complete.

**Independent tasks (can run in parallel):**

- **Task 3** (map-toolkit) and **Task 4** (design-toolkit) are independent —
  they touch different packages and both depend only on the geo API, so they
  can be implemented simultaneously once Tasks 1 and 2 land.

**Sequential dependencies:**

- Task 1 → Task 2 (shared parts core must exist before grid parts build on it).
- Tasks 1,2 → Tasks 3,4 (consumers need the geo API).
- Tasks 3,4 → Task 5 (gate + changesets close out the change).

**Critical path:**

Task 1 → Task 2 → (Task 3 ∥ Task 4) → Task 5

**Recommended implementation order:**

1. Task 1 (geo DD/DDM/DMS parts + compose).
2. Task 2 (geo MGRS/UTM grid parts + discriminated result + boundary).
3. Tasks 3 and 4 in parallel (migrate map-toolkit and design-toolkit).
4. Task 5 (verification gate + changesets).
