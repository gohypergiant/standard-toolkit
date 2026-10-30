---
change: add-land-defense-icons
created_at: "2026-10-20T00:44:03Z"
started_at: "2026-10-20T01:02:02Z"
completed_at: "2026-10-20T01:36:51Z"
specs_touched: [land-defense-icons]
decisions:
  - id: D1
    choice: Rename only the artifact's radar design, to mobile-radar (MobileRadar, @accelint/icons/mobile-radar)
    rationale: The id collides with an existing public export; "Mobile radar" is the artifact's own label and fits alongside radar-site and radar-anomaly
    alternatives: ["replace radar (breaking, major)", radar-mobile, ground-radar]
  - id: D2
    choice: Keep the other 17 artifact ids unchanged (sm2, not sm-2)
    rationale: The artifact ids are the only naming source; generated names pass Biome useNamingConvention and ls-lint kebab-case
    alternatives: ["hyphenate digits (sm-2, m-198)"]
  - id: D3
    choice: Copy the zip's toolkit-24/<id>.svg files byte-for-byte as the source
    rationale: Every copy in the artifact holds the same path data; a byte copy makes provenance checkable with diff; no formatter or linter applies to .svg
    alternatives: [pretty-print to match existing multi-line sources]
  - id: D4
    choice: Accept SVGO's default 3-decimal rounding; leave svgoConfig unchanged
    rationale: The largest observed change is 0.001 units, in `thaad`; changing precision is a shared-config change that would regenerate existing icons
    alternatives: [raise floatPrecision]
  - id: D5
    choice: Keep fill="currentColor" as authored
    rationale: The pipeline passes currentColor through and 55 existing sources already use it
    alternatives: ["convert to #898989 per README step 2"]
  - id: D6
    choice: "Changeset @accelint/icons: minor, as a one-line summary; provenance goes in the PR description"
    rationale: Adds backward-compatible functionality (precedent 5ce2a0c); past icon Changesets are one-line and cite no provenance
    alternatives: [major like 8070d19]
  - id: D7
    choice: No design-toolkit Changeset entry for the catalog update
    rationale: src/icons is excluded from the design-toolkit build, so the catalog change is Storybook-only
    alternatives: [follow precedent with a design-toolkit minor/patch]
  - id: D8
    choice: "Add the 17 mobile platforms to catalog 'map dynamic' and the fixed aegis-ashore site to 'map static'"
    rationale: "Both categories are 'Icons that could represent entities on a map'; the closest existing icons (missile, missiles, military-vessel, uas) are in 'map dynamic', and fixed sites (airport, battle-station) are in 'map static'"
    alternatives: [all 18 in symbols, "all 18 in 'map dynamic'", new land/defense category]
  - id: D9
    choice: Verify completeness with one-off counts and resolution checks, not committed tests
    rationale: The package has no test convention (ARCHITECTURE.md section 8)
    alternatives: [add a vitest export-resolution test]
---

## Context

See proposal.md (Why) for motivation. This change is additive. It uses the existing pipeline unchanged.

### Current State

- `packages/icons/src/svg/` holds 241 source SVGs. It is the source of truth (`packages/icons/AGENTS.md`). Source colour is either `#898989` (180 files) or `currentColor` (55 files). `svgr.config.mjs` `replaceAttrValues` maps `#898989`/`#fff`/`white` to `currentColor` and passes `currentColor` through unchanged.
- `generate:icons` (`svgr --no-prettier --config-file svgr.config.mjs -- src/svg`) rewrites every `src/icons/*.tsx` and `src/icons/index.ts`. The raw output is unformatted. The `build` script then runs `tsdown`, then `license`, then `biome check --write --linter-enabled=false`. That normalizes it: headers, formatting, and the sorted named-export order in `index.ts`.
- tsdown (`unbundle: true`, `exports: true`) writes one `dist/<name>.js`/`.d.ts` per icon. It rewrites `package.json` `exports`: keys sorted by code point, `./package.json` last.
- The SVGR/SVGO config:
  - `dimensions: false` plus `svgProps { fill: 'none', viewBox: '0 0 24 24' }` drops `width`/`height`.
  - `titleProp: true` emits `title`/`titleId` props and `aria-labelledby`.
  - `removeUnknownsAndDefaults.keepAriaAttrs: true` keeps any `aria-*` attribute that appears in the source.
  - `preset-default` `convertPathData` rounds coordinates to 3 decimals. A semantically matched `thaad` coordinate (`17.401` → `17.4`) confirms that path optimization can produce up to a 0.001-unit delta.
- Consumers mostly use default subpath imports (65 files), then named root imports (28) and `import * as Icon` (1, `design-toolkit/src/icons/catalog.tsx`).
- `design-toolkit/src/icons/catalog.tsx` groups icons into categories including `actions`, `symbols`, `'map dynamic'`, `'map static'`, `controls` and `feedback`. Both map categories are described as "Icons that could represent entities on a map." `missile`, `missiles`, `military-vessel` and `uas` are in `'map dynamic'`; `airport`, `battle-station` and `car` are in `'map static'`; `radar` is in `symbols`. Each entry has the shape `{ name: '<kebab>', icon: <Icon.Pascal /> }`. The Storybook story `Foundation/Icons` (`icons.stories.tsx`) renders the catalog. `src/icons` is excluded from the design-toolkit build (`tsdown.config.ts` `!src/icons`).
- No icon tests, export-resolution checks or visual-regression snapshots of the catalog exist. `publint` flags a missing subpath `.js` but not a missing `.d.ts`.

### Data flow

```
 artifact zip toolkit-24/<id>.svg   (18 files, single-line, fill=currentColor)
            | copy (rename radar -> mobile-radar)
            v
 packages/icons/src/svg/<name>.svg  (241 -> 259)           <- source of truth
            | pnpm --filter @accelint/icons build
            |   generate:icons (SVGR + SVGO, all files)
            v
 src/icons/<name>.tsx + index.ts    (241 -> 259 modules; existing byte-identical)
            |   tsdown (unbundle, exports: true)
            v
 dist/<name>.js|.d.ts  +  package.json "exports" (+18 sorted keys)
            |   license + biome check --write (normalize generated files)
            v
 consumers: @accelint/icons/<name> (default)  |  @accelint/icons { Pascal }
            v
 design-toolkit catalog.tsx 'map dynamic' / 'map static' -> Storybook Foundation/Icons
```

### Desired End State

- 18 new source SVGs:
  - 17 named by their artifact id.
  - The artifact's `radar` (label "Mobile radar") becomes `mobile-radar.svg`.
- 18 new generated components and root named exports (`MobileRadar`, `Sm2`, `M198`, ...). 18 new subpath exports (`./mobile-radar`, `./sm2`, ...).
- 18 new catalog entries: 17 in `'map dynamic'` and `aegis-ashore` in `'map static'`.
- One Changeset: `@accelint/icons: minor`.
- Unchanged:
  - All 241 existing sources and generated `.tsx` files, including `radar`, `radar-site` and `radar-anomaly`.
  - `dist/radar.js` output.
  - Existing export keys.
  - The SVGR/SVGO/tsdown config.
  - `src/index.ts`.
  - All `tooling/*` and root configs.

## Goals / Non-Goals

**Goals:**
- Each new icon goes through the same pipeline and contract as existing icons: 24×24 viewBox, `currentColor` fill, no stroke, `title`/`titleId` props, per-icon subpath.
- Geometry matches the artifact's 24px path data, within the pipeline's 3-decimal rounding.
- The 18 new icons can be traced through every layer: artifact → `src/svg` → `src/icons` → `index.ts` → `exports` → `dist` → catalog.

**Non-Goals:**
- Changing SVGO precision or any generator setting. That would regenerate existing icons.
- Adding a test suite, export-resolution script or `.d.ts` check to the package. Checks in this change are one-off verification steps only.
- Fixing pre-existing README inaccuracies or the stale gitignored `dist/`.

## Patterns to Follow

- Commit 5ce2a0c ("Adds new map-related icons"): the icon-addition shape (source SVGs, regenerated `src/icons`, catalog entries) with a `minor` icons Changeset.
- Commit 8070d19: build-written `package.json` export additions appear as added lines only.
- `packages/design-toolkit/src/icons/catalog.tsx` `'map dynamic'` entries such as `missile`, `missiles`, `military-vessel` and `uas`, and `'map static'` entries such as `airport` and `battle-station`. Insert new entries in alphabetical position by `name`. Use the kebab file name as `name` and the generated Pascal export as the component.
- Existing `currentColor` sources in `src/svg` (55 files) show that `currentColor` input is valid as-is.

## Patterns to Avoid

- Hand-editing `src/icons/*.tsx`, `src/icons/index.ts` or the `exports` field. Regenerate through `pnpm --filter @accelint/icons build` instead.
- Copying the artifact's table-row inline `<svg>`. It carries `aria-hidden`, and `keepAriaAttrs: true` would keep that attribute in the generated component, which would hide titled icons from assistive technology. Use the zip `toolkit-24/` files, which have no `aria-hidden`.
- Overwriting `src/svg/radar.svg` with the artifact's `radar` design. That would silently change the published `radar` export.
- Running `pnpm indexer`/`pnpm index` for this package. The package has no `index` script, and the icon barrel comes from SVGR.
- Adding the COP 32px files to `src/svg`. Their `#FF69B4` fill does not map to `currentColor`, and their viewBox is 32×32.

## Resolved Decisions

**Decision 1: Rename only `radar`, to `mobile-radar`.**
- Choice: `mobile-radar.svg` → `MobileRadar` / `@accelint/icons/mobile-radar`.
- Rationale: The id collides with an existing public export. The artifact's own label is "Mobile radar". The name sits next to `radar-site` and `radar-anomaly` and keeps the `radar-*` family readable. Simulation confirms both subpaths resolve to distinct modules.
- Alternatives Considered:
  - Replace `radar`: breaking, so `major`.
  - `radar-mobile`: groups with `radar-*` but reads less naturally.
  - `ground-radar`: not the artifact's term.

**Decision 2: Keep the other 17 artifact ids unchanged (`sm2`, not `sm-2`).**
- Choice: Use the ids as given.
- Rationale: The artifact ids are the only naming source. Simulation shows the generated names (`Sm2`, `M198`, `TbmLauncher`) pass Biome `useNamingConvention` and ls-lint kebab-case. No existing convention for digits favours hyphens.
- Alternatives Considered: Hyphenate digits (`sm-2`, `m-198`). This invents a convention without precedent and drifts from the artifact and Figma ids.

**Decision 3: Use zip `toolkit-24/<id>.svg` files byte-for-byte as source.**
- Choice: Copy the single-line files unchanged except for the `mobile-radar` filename.
- Rationale: For all 18, the zip, the base64 downloads, the article previews and `manifest.json` path data are identical. A byte copy makes provenance checkable with `diff`. No formatter or linter applies to `.svg`, and the 3-line layout of existing files is not enforced.
- Alternatives Considered: Pretty-print to match the 3+ line layout of existing sources. This is cosmetic only and adds a manual step that could alter path data.

**Decision 4: Accept SVGO's default 3-decimal rounding.**
- Choice: Do not change `svgoConfig`.
- Rationale: The maximum semantically matched coordinate change is 0.001 units (`thaad` `17.401` → `17.4`); the other observed deltas are ≤ 0.0005. That is about 0.001px at 24px, far below a device pixel. Changing precision is a shared-config change and would regenerate existing icons. Here, "preserve geometry" means the same shapes and path commands, with numeric drift ≤ 0.001.
- Alternatives Considered: Raise `floatPrecision`. This is out of scope, needs approval, and changes all icons.

**Decision 5: Keep `fill="currentColor"` as authored.**
- Choice: Do not convert to `#898989`.
- Rationale: The pipeline passes `currentColor` through. 55 existing sources already use it. Converting would only add a step that SVGR then undoes.
- Alternatives Considered: Follow README step 2 literally (`#898989`). The output is identical, so the extra edit adds risk with no benefit.

**Decision 6: Changeset is `@accelint/icons: minor`, as a one-line summary.**
- Choice: A summary in the style "Adds land and defense platform icons: …" that lists the 18 names. Provenance goes in the PR description, not the Changeset: artifact name and date, Figma file key `yMWadmpVp2WC6VAOpFQwqx` / page `44037:2`, and `conformance.json` status `pass`.
- Rationale: The change adds backward-compatible functionality (`documentation/workflows.md`; precedent 5ce2a0c). Past icon Changesets are one-line and cite no provenance. The pending `chatty-stars-sleep.md` `patch` merges into the higher bump. `beta-experimental-releases` is a proposal only, and main is not in pre-release mode (no `pre.json`).
- Alternatives Considered: Bump `major` like 8070d19. That release included a rename, which this change does not.

**Decision 7: No design-toolkit Changeset entry.**
- Choice: Update `catalog.tsx` without a design-toolkit bump.
- Rationale: `src/icons` is excluded from the design-toolkit build, so the change is Storybook-only (root AGENTS.md: no Changeset needed). If `pnpm changeset status` shows an automatic design-toolkit bump through the `@accelint/icons` peer `workspace:*`, accept the tool's result and do not add one by hand.
- Alternatives Considered: Follow precedent and list design-toolkit `minor`/`patch`. This would publish a release with no shipped change.

**Decision 8: Categorize by mobility in the existing map categories.**
- Choice: Add the 17 mobile platforms (vehicles, launchers, artillery, missiles, mobile radar) to `'map dynamic'`. Add `aegis-ashore`, a fixed installation, to `'map static'`.
- Rationale: Both map categories are described as "Icons that could represent entities on a map." The closest existing icons (`missile`, `missiles`, `military-vessel`, `uas`) live in `'map dynamic'`, and fixed sites (`airport`, `battle-station`) live in `'map static'`. (A first draft of this decision said `missile`, `missiles` and `car` were in `symbols`; that was wrong, and only `radar` is.)
- Alternatives Considered:
  - All 18 in `symbols`: does not match where related platform icons live.
  - All 18 in `'map dynamic'`: puts a fixed site among mobile entities.
  - A new `land` or `defense` category: a new taxonomy with no precedent.

**Decision 9: Verify completeness with one-off counts and resolution checks, not new committed tests.**
- Choice: Verify the counts listed below and report the evidence. Nothing new is committed for verification.
  - `src/svg` 259.
  - `src/icons/*.tsx` 259 with 259 `index.ts` exports.
  - `exports` 259 + `.` + `./package.json`.
  - `dist` 259 `.js` / 259 `.d.ts`.
  - Catalog contains all 18.
  - `import.meta.resolve` of `@accelint/icons/radar` vs `/mobile-radar` gives distinct modules.
  - `git diff --stat` shows no modified existing icon files.
- Rationale: The package has no test convention (`ARCHITECTURE.md` §8). Adding one is a broader change.
- Alternatives Considered: Add a vitest export-resolution test. That is new test infrastructure, so it is out of scope.

## Accessibility

- Generated components keep the existing contract: `title`/`titleId` props render `<title>` and `aria-labelledby`. Decorative use is up to consumers, same as today.
- The source files have no `aria-hidden`, `role` or interactive elements (Decision 3; Patterns to Avoid).
- The catalog story renders icons next to a visible text name. No react-aria component, keyboard path, focus or screen-reader behavior changes.

## Storybook

`Foundation/Icons` (`packages/design-toolkit/src/icons/icons.stories.tsx`) shows the 18 new icons under `'map dynamic'` (17) and `'map static'` (`aegis-ashore`) with no story code change. It is a manual visual check only, because no visual-regression snapshot covers it.

## Risks / Trade-offs

- [Designs or names are not approved: A1, C9, C10, C12] → Implementation is gated on the Open Questions below. Renames before merge are cheap. After publish, a rename is `major`.
- [The artifact is a review candidate ("do not replace recognition testing")] → Cite the review status in the PR. Do not claim operator validation.
- [Public release of defense-platform silhouettes derived from credited photos, some marked "reference only"] → Escalate (Open Question 3). The repo has no documented clearance process.
- [Changesets may bump design-toolkit through the peer `workspace:*`] → Check `pnpm changeset status` and report the result (Decision 7).
- [publint does not catch a missing `.d.ts`] → Count `dist/*.d.ts` explicitly (Decision 9).
- [`lint:fs` hung during research. The untracked `.tickets/` fails ls-lint locally] → CI checkouts exclude untracked files. Run `lint:fs` in a clean worktree or report it as unverified.
- [`build` and `format` rewrite tracked files] → Expected diffs are only the 18 new `.tsx` files, `index.ts` lines and `exports` keys. Report any other diff and do not commit it.

## Migration Plan

- Additive. Consumers opt in by importing the new names.
- Rollback: revert the commit (sources, generated files, exports, catalog, Changeset).
- After publish, removal or rename is a `major` change.

## Open Questions

These need human input before implementation or merge. None of them can be determined from the repository.

1. **Approval status:** Are all 18 designs approved for release? The artifact has review checkboxes with no embedded results, and the zip README says "no production merge". If any design is withheld, the count drops and the spec list changes.
2. **Final names:** Confirm `mobile-radar` for the artifact's `radar`. Confirm the abbreviated ids (`comms`, `convoy`, `sm2`/`sm3`/`sm6`, `m198`, `m777`, `mrap`, `jltv`, `thaad`, `tbm-launcher`, `sam-launcher`) as public names.
3. **Release clearance:** Is a public-release or export-control review required before publishing defense-platform silhouettes in an Apache-2.0 public package? Does the "reference only" imagery credit affect derivation rights?
4. **Figma publication:** Must the 36 unpublished Figma components (file `yMWadmpVp2WC6VAOpFQwqx`, page `44037:2`) be published before the toolkit release, or is the HTML/zip handoff sufficient?
5. **Supersession:** Do any earlier rounds (round-3 references) or later rounds supersede designs in RND4? Nothing from earlier rounds exists in this repo.
6. **COP variants:** Will a follow-up ticket bring the 32px COP files to `@accelint/ntds`? This does not affect this change, but it should be recorded.
