## Why

The land and defense design review (`land-icons-profile-review-rnd4.html`, footer "16 October 2026 · Latest versions · 18 subjects · 36 SVG exports") contains 18 new 24px icons: launchers, air-defense systems, artillery, tactical vehicles, a mobile radar, a comms unit and missile profiles. None of them exist in `@accelint/icons` today. Consumers need them as published `@accelint/icons` exports that follow the same contract as the existing 241 icons. One artifact id, `radar`, collides with the existing `radar` export, so it needs a new name.

Driving requirement: ship the 18 24px designs from the review artifact as `@accelint/icons` components, with no change to existing icons.

## What Changes

- Add 18 source SVGs to `packages/icons/src/svg/`. 17 keep their artifact ids: `shorad`, `tbm-launcher`, `sam-launcher`, `artillery`, `convoy`, `thaad`, `patriot`, `m198`, `m777`, `comms`, `mrap`, `humvee`, `jltv`, `aegis-ashore`, `sm2`, `sm3`, `sm6`. The 18th design (artifact id `radar`, label "Mobile radar") becomes `mobile-radar.svg`.
- Regenerate `src/icons/*.tsx` and `src/icons/index.ts` with the existing `generate:icons` script. Research simulation shows this adds 18 `.tsx` files and the matching index lines, and leaves existing files byte-identical.
- The build (tsdown `exports: true`) adds 18 new subpath exports to `packages/icons/package.json`, e.g. `./mobile-radar` and `./sm2`.
- Add the 18 icons to `packages/design-toolkit/src/icons/catalog.tsx`: 17 mobile platforms under `'map dynamic'` and `aegis-ashore` under `'map static'`. This file is used only by Storybook and is excluded from the design-toolkit build (`!src/icons` in `tsdown.config.ts`).
- Add a Changeset with a `minor` bump for `@accelint/icons`.
- No **BREAKING** changes. The existing `radar`, `radar-site` and `radar-anomaly` exports keep their current output.

## Scope

In scope:
- 18 24px `currentColor` designs from the artifact, one per subject.
- Generated React components, root named exports and per-icon subpath exports.
- Storybook catalog entries.

Out of scope:
- The 18 32px COP variants (`cop-32/`, `#FF69B4` fill, outside black stroke). They match the `@accelint/ntds` masked-icon convention, not `@accelint/icons`.
- Filled/outline pairs or other sizes.
- Changes to existing icons, including renaming or redrawing `radar`.
- Changes to the SVGR/SVGO config, `tooling/*`, root configs or build scripts.
- Publishing components in Figma. Recognition testing with operators.
- Committing the review HTML artifact, the zip contents (`manifest.json`, `conformance.json`, `figma-handoff.json`) or `.tickets/` to the repo.
- Export-resolution or `.d.ts` presence tests for the whole package (no such convention exists today).
- README fixes (e.g. named-subpath examples that do not match the generated default exports). These are pre-existing and unrelated.

## Capabilities

### New Capabilities
- `land-defense-icons`: the 18 land and defense icons published by `@accelint/icons`. Covers names, subpath and root exports, the `currentColor`/24×24 viewBox contract, and coexistence with the existing `radar` icon.

### Modified Capabilities
None. No existing spec covers icons (`openspec/specs/INDEX.md`).

## Impact

- **Packages touched:**
  - `@accelint/icons`: `src/svg`, generated `src/icons`, build-written `package.json` exports, and a Changeset.
  - `@accelint/design-toolkit`: Storybook-only `src/icons/catalog.tsx`.
- **Downstream dependents in the monorepo:**
  - `@accelint/design-toolkit` (dependency + peer `workspace:*`).
  - `apps/next` (dependency).
  - No in-repo code imports the new names. The only in-repo `Radar` consumer is `catalog.tsx:161`, and its output does not change.
- **Public API:** 18 new named root exports (`Shorad`, `TbmLauncher`, `SamLauncher`, `Artillery`, `Convoy`, `Thaad`, `Patriot`, `M198`, `M777`, `MobileRadar`, `Comms`, `Mrap`, `Humvee`, `Jltv`, `AegisAshore`, `Sm2`, `Sm3`, `Sm6`) and 18 new default-export subpaths. Additive only.
- **Semver:**
  - `@accelint/icons`: `minor` (new backward-compatible functionality, per `documentation/workflows.md`; precedent 5ce2a0c).
  - `@accelint/design-toolkit`: no Changeset entry, because the change is Storybook-only. Changesets may still bump it through `updateInternalDependencies`/peer rules; confirm with `pnpm changeset status`.
- **Dependencies:** none added or upgraded.
- **Release clearance:** `@accelint/icons` is public (Apache-2.0, `publishConfig.access: public`). Design approval and release clearance for defense-platform silhouettes cannot be confirmed from the repo. See design.md Open Questions.
