> Merge precondition (not a code blocker): design.md Open Questions 1-6 (design approval, final names, release clearance, Figma publication, supersession, COP follow-up) are unresolved. Code work may proceed. Record each question and its answer, or "unresolved", in the PR description (task 5.4) before the PR is marked ready. If Open Question 1 or 2 withholds or renames any icon, update `specs/land-defense-icons/spec.md` and the counts in groups 4-5 before merge.
>
> Rules for every task: use `pnpm` only. Do not hand-edit `src/icons/*.tsx`, `src/icons/index.ts` or `package.json` `exports`; regenerate with `pnpm --filter @accelint/icons build`. Do not modify `svgr.config.mjs`, `tsdown.config.ts`, `tooling/*` or root configs. Do not run `pnpm index`/`pnpm indexer` for `@accelint/icons`. Do not commit or push.
>
> Source files: the artifact zip's `toolkit-24/<id>.svg` files, extracted from `land-icons-profile-review-rnd4.html` to a scratch directory outside the repo (for example `/tmp/land-icons-rnd4/`). Never use the HTML table-row inline `<svg>` (it carries `aria-hidden`). Never use `cop-32/` files.

## 1. Tracer slice: `mobile-radar` end to end, with `radar` unchanged [PKG:icons] [PKG:design-toolkit]

Deliverable: `@accelint/icons/mobile-radar` (`MobileRadar`) builds, resolves to its own module distinct from `@accelint/icons/radar`, renders the icon contract, and appears in the Storybook catalog under `'map dynamic'`; `radar`, `radar-site` and `radar-anomaly` are byte-identical to the baseline. Proves the pipeline, the rename and the catalog pattern before the other 17 icons are added.

Dependencies: none. Groups 2 and 3 depend on this group.

- [x] 1.1 [PKG:icons] Capture the baseline: run `pnpm --filter @accelint/icons build` on the unchanged tree, then copy `packages/icons/dist/radar.js`, `dist/radar-site.js`, `dist/radar-anomaly.js` and the `exports` object from `packages/icons/package.json` to `/tmp/icons-baseline/`. Confirm `git status --short packages/icons` shows no tracked changes from the baseline build (the build is expected to be a no-op on committed files).
- [x] 1.2 [PKG:icons] Extract the artifact zip to `/tmp/land-icons-rnd4/` and confirm it holds 18 `toolkit-24/*.svg` files, 18 `cop-32/*.svg` files, `manifest.json` and `conformance.json` (status `pass`). Do not copy any of these into the repo.
- [x] 1.3 [PKG:icons] Copy `/tmp/land-icons-rnd4/toolkit-24/radar.svg` byte-for-byte to `packages/icons/src/svg/mobile-radar.svg` (Decision 1, Decision 3). Do not touch `src/svg/radar.svg`.
- [x] 1.4 [PKG:icons] Run `pnpm --filter @accelint/icons build`. Confirm the only changes are new `src/svg/mobile-radar.svg`, new `src/icons/mobile-radar.tsx`, an added `MobileRadar` line in `src/icons/index.ts` (in the build's sorted order) and an added `./mobile-radar` key in `package.json` `exports`.
- [x] 1.5 [PKG:design-toolkit] Add `{ name: 'mobile-radar', icon: <Icon.MobileRadar /> }` to the `'map dynamic'` category in `packages/design-toolkit/src/icons/catalog.tsx`, in alphabetical position by `name` (after `missiles`, before `personal-boat`) (Decision 8). Leave the existing `radar` entry in `symbols` unchanged.
- [x] 1.6 Test: `diff /tmp/land-icons-rnd4/toolkit-24/radar.svg packages/icons/src/svg/mobile-radar.svg` reports no difference; `git diff --exit-code packages/icons/src/svg/radar.svg packages/icons/src/icons/radar.tsx packages/icons/src/icons/radar-site.tsx packages/icons/src/icons/radar-anomaly.tsx` exits 0; `cmp` of `dist/radar.js`, `dist/radar-site.js` and `dist/radar-anomaly.js` against `/tmp/icons-baseline/` reports identical.
- [x] 1.7 Test: from `packages/design-toolkit`, run a one-off `node --input-type=module` script (not committed) that prints `import.meta.resolve('@accelint/icons/radar')` and `import.meta.resolve('@accelint/icons/mobile-radar')`, and confirm they end in `dist/radar.js` and `dist/mobile-radar.js` and that the two default exports are different functions. In the same script, render `MobileRadar` with `react-dom/server` `renderToStaticMarkup` with `title="Mobile radar"` and `titleId="mr"` and confirm the markup has `viewBox="0 0 24 24"`, `fill="currentColor"`, `<title id="mr">Mobile radar</title>`, `aria-labelledby="mr"`, and no `aria-hidden`, `width`, `height` or `stroke`.
- [x] 1.8 Test: `grep -n "import" packages/icons/dist/mobile-radar.js` shows no import other than `react/jsx-runtime`; run `pnpm --filter @accelint/design-toolkit preview` and confirm `Foundation/Icons` shows `mobile-radar` under `'map dynamic'` and the unchanged `radar` glyph under `symbols` (manual check; no visual-regression snapshot covers this story).

## 2. Slice: 13 icons with exact geometry, including digit-bearing names [PKG:icons] [PKG:design-toolkit]

Deliverable: `shorad`, `artillery`, `convoy`, `m198`, `m777`, `comms`, `mrap`, `humvee`, `jltv`, `aegis-ashore`, `sm2`, `sm3`, `sm6` are published as subpaths and root named exports, render the icon contract with geometry exactly equal to the artifact, and appear in the catalog. Proves the unhyphenated digit naming (`Sm2`, `M198`) end to end.

Dependencies: requires group 1. Groups 2 and 3 edit the same generated files (`src/icons/index.ts`, `package.json` `exports`) and `catalog.tsx`; if run in parallel, add both sets of sources first and run one `pnpm --filter @accelint/icons build` afterwards (generation is deterministic), then merge the catalog entries.

- [x] 2.1 [PKG:icons] Copy the 13 files `/tmp/land-icons-rnd4/toolkit-24/{shorad,artillery,convoy,m198,m777,comms,mrap,humvee,jltv,aegis-ashore,sm2,sm3,sm6}.svg` byte-for-byte to `packages/icons/src/svg/` with the same file names. Do not pretty-print or recolour them (Decisions 2, 3, 5).
- [x] 2.2 [PKG:icons] Run `pnpm --filter @accelint/icons build`. Confirm 13 new `src/icons/*.tsx` files, 13 added lines in `src/icons/index.ts` (`AegisAshore`, `Artillery`, `Comms`, `Convoy`, `Humvee`, `Jltv`, `M198`, `M777`, `Mrap`, `Shorad`, `Sm2`, `Sm3`, `Sm6`) and 13 added `exports` keys, with no other tracked change.
- [x] 2.3 [PKG:design-toolkit] Add 12 of the 13 entries (all except `aegis-ashore`) to catalog `'map dynamic'`, and `aegis-ashore` to catalog `'map static'` (before `airport`), in alphabetical position by `name` (Decision 8), each as `{ name: '<kebab>', icon: <Icon.<Pascal> /> }` (for example `{ name: 'sm2', icon: <Icon.Sm2 /> }`).
- [x] 2.4 Test: for each of the 13 names, `diff /tmp/land-icons-rnd4/toolkit-24/<name>.svg packages/icons/src/svg/<name>.svg` reports no difference; `ls packages/icons/dist/{sm2,m198}.{js,d.ts}` lists all four files; `@accelint/icons/sm-2` and `@accelint/icons/m-198` are not keys in `package.json` `exports`.
- [x] 2.5 Test: from `packages/design-toolkit`, a one-off script renders each of the 13 default subpath exports with `renderToStaticMarkup` and confirms `viewBox="0 0 24 24"`, `fill="currentColor"`, no `aria-hidden`/`width`/`height`/`stroke`, and that `import { Sm2, M198, AegisAshore } from '@accelint/icons'` returns the same functions as the matching subpath default exports. A one-off comparison of absolute path coordinates (generated `d` vs. artifact `d`) shows zero difference for all 13 icons.
- [x] 2.6 Test: `pnpm --filter @accelint/icons lint` and `pnpm --filter @accelint/design-toolkit lint` pass (Biome `useNamingConvention` accepts `Sm2`, `M198`, `M777`).

## 3. Slice: 4 icons affected by 3-decimal rounding [PKG:icons] [PKG:design-toolkit]

Deliverable: `tbm-launcher`, `sam-launcher`, `thaad` and `patriot` are published as subpaths and root named exports, appear in the catalog, and their generated geometry differs from the artifact only by SVGO's 3-decimal rounding (max 0.0005 units). SVGO config stays unchanged (Decision 4).

Dependencies: requires group 1. See group 2 for the shared-file note if groups 2 and 3 run in parallel.

- [x] 3.1 [PKG:icons] Copy `/tmp/land-icons-rnd4/toolkit-24/{tbm-launcher,sam-launcher,thaad,patriot}.svg` byte-for-byte to `packages/icons/src/svg/`.
- [x] 3.2 [PKG:icons] Run `pnpm --filter @accelint/icons build`. Confirm 4 new `src/icons/*.tsx` files, 4 added lines in `src/icons/index.ts` (`Patriot`, `SamLauncher`, `TbmLauncher`, `Thaad`) and 4 added `exports` keys, with no other tracked change. Confirm `git diff --exit-code packages/icons/svgr.config.mjs` exits 0.
- [x] 3.3 [PKG:design-toolkit] Add the 4 entries to catalog `'map dynamic'` in alphabetical position by `name` (for example `{ name: 'tbm-launcher', icon: <Icon.TbmLauncher /> }`).
- [x] 3.4 Test: for each of the 4 names, `diff` of artifact vs. `src/svg/<name>.svg` reports no difference. A one-off script (not committed) converts the artifact `d` and the generated `.tsx` `d` to semantically matched absolute coordinates and reports the maximum per-coordinate difference: it MUST be no more than 0.001 for each icon, with the same number of path commands. Spot-check that `19.88667` (`tbm-launcher`), `13.65556` (`sam-launcher`) and `17.36389` (`thaad`) map to `19.887`, `13.656` and `17.364`; accept the semantically matched `thaad` coordinate `17.401` → `17.4`.
- [x] 3.5 Test: render `Thaad` and `Patriot` with `renderToStaticMarkup` from `packages/design-toolkit` and confirm the same contract checks as task 2.5; `ls packages/icons/dist/{tbm-launcher,sam-launcher,thaad,patriot}.{js,d.ts}` lists all 8 files.

## 4. Integration check: completeness, additive-only diff and COP exclusion [PKG:icons] [PKG:design-toolkit]

Deliverable: recorded evidence that all 18 icons are present in every layer, that nothing existing changed, and that no COP 32px file entered the package. This group spans groups 1-3 and checks package-wide invariants that no single slice can prove, so it is a separate integration group (allowed by the tasks instruction). No verification code is committed (Decision 9).

Dependencies: requires groups 1, 2 and 3.

- [x] 4.1 [PKG:icons] Run a fresh `pnpm --filter @accelint/icons build`, then record these counts: `src/svg/*.svg` = 259; `src/icons/*.tsx` excluding `index.ts` = 259; export lines in `src/icons/index.ts` = 259; `package.json` `exports` keys = 261 (259 icons + `.` + `./package.json`, with `./package.json` last); `dist/*.js` icon modules = 259; `dist/*.d.ts` icon declarations = 259. Count `.d.ts` explicitly, because `publint` does not report a missing `.d.ts`.
- [x] 4.2 [PKG:icons] Compare the new `exports` object with `/tmp/icons-baseline/` exports: every baseline key and target is present and unchanged, and exactly 18 keys were added, in code-point order.
- [x] 4.3 [PKG:icons] Confirm `git diff --stat -- packages/icons` shows modifications only to `src/icons/index.ts` and `package.json`, and that every other entry is one of the 18 new `.svg` or 18 new `.tsx` files. Confirm `git diff --exit-code packages/icons/src/index.ts` exits 0. Report and do not commit any other diff.
- [x] 4.4 [PKG:icons] Confirm no file in `packages/icons/src/svg` added by this change contains `viewBox="0 0 32 32"` or `#FF69B4`, and no `cop-32` file was copied.
- [x] 4.5 [PKG:design-toolkit] Confirm `catalog.tsx` `'map dynamic'` contains the 17 mobile-platform names, `'map static'` contains `aegis-ashore`, each of the 18 names appears exactly once across the file, and the `symbols` `radar` entry still uses `<Icon.Radar />`. Run `pnpm --filter @accelint/design-toolkit build` and confirm `grep -rl "MobileRadar\|TbmLauncher" packages/design-toolkit/dist` returns nothing (catalog is excluded from the build).
- [x] 4.6 Test: all counts in 4.1 match, 4.2-4.5 pass, and the evidence (commands and outputs) is saved for the PR description in task 5.4.

## 5. Changeset, verification gate and PR record [PKG:icons] [PKG:design-toolkit]

Deliverable: one `@accelint/icons: minor` Changeset, a passing verification gate, and a PR description draft that records provenance and the unresolved Open Questions.

Dependencies: requires group 4. This is the final group.

- [x] 5.1 [PKG:icons] Run `pnpm changeset` and create one Changeset with `"@accelint/icons": minor` and a one-line summary, for example: "Adds land and defense platform icons: aegis-ashore, artillery, comms, convoy, humvee, jltv, m198, m777, mobile-radar, mrap, patriot, sam-launcher, shorad, sm2, sm3, sm6, tbm-launcher, thaad." Do not add a `@accelint/design-toolkit` entry (Decisions 6, 7). Do not put the Figma key or artifact provenance in the Changeset.
- [x] 5.2 Run `pnpm changeset status` and record the result: `@accelint/icons` gets `minor` (the pending `chatty-stars-sleep.md` `patch` merges into it). If design-toolkit is bumped automatically through the `workspace:*` peer, accept it and record it; do not add or remove entries by hand.
- [x] 5.3 Run the verification gate from the repo root in this order and record pass/fail for each: `pnpm run build`; `pnpm tsc --noEmit -p tsconfig.dist.json` in `packages/design-toolkit` and in `packages/map-toolkit`; `pnpm run test`; `pnpm run lint`; `pnpm run format`. Then run `pnpm run format:check`, `pnpm run lint:deps`, `pnpm run lint:package` and `pnpm run lint:fs`. Run `lint:fs` in a clean worktree without the untracked `.tickets/` and HTML artifact, or report it as unverified if it hangs. After `build` and `format`, confirm `git status` shows no new tracked diffs beyond those listed in 4.3, `catalog.tsx` and the Changeset. Record any pre-existing, unrelated failure separately.
- [x] 5.4 Draft the PR description following `.github/PULL_REQUEST_TEMPLATE.md`: provenance (artifact `land-icons-profile-review-rnd4.html`, footer date 16 October 2026, Figma file key `yMWadmpVp2WC6VAOpFQwqx`, page `44037:2`, `conformance.json` status `pass`); review status ("design-review candidates; not validated by operator recognition testing"); each of design.md Open Questions 1-6 with its answer or "unresolved"; the evidence from groups 1-4 and 5.2-5.3; the catalog placement (Decision 8: 17 under `'map dynamic'`, `aegis-ashore` under `'map static'`); and the `ai` label. Do not commit the HTML artifact, zip contents or `.tickets/`.
- [x] 5.5 Test: the gate in 5.3 passes (or every failure is shown to be pre-existing and unrelated), exactly one new Changeset exists under `.changeset/` naming only `@accelint/icons: minor`, and the PR description lists Open Questions 1-6. The PR is not marked ready until Open Questions 1-3 have recorded answers.

## Parallelization Strategy

### Dependencies (Must Complete First)

- **Group 1** (tracer: `mobile-radar`) must finish first. It captures the baseline and proves the pipeline, the rename and the catalog pattern before more icons are added.
- **Group 4** must wait until Groups 1, 2 and 3 complete. It checks invariants across the whole package.
- **Group 5** must wait until Group 4 completes. It is the changeset, the verification gate and the PR record.

**Independent tasks (can run in parallel):**
- Groups 2 and 3 are independent in content (different source SVGs and catalog entries). Both regenerate the same files (`src/icons/index.ts`, `package.json` `exports`) and edit `catalog.tsx`. If run in parallel: copy both sets of sources, run one `pnpm --filter @accelint/icons build`, then merge the catalog entries. Do not run two builds at the same time.

**Sequential dependencies:**
- Group 1 → Groups 2/3: the baseline (1.1) and the extracted artifact (1.2) are inputs to both.
- Groups 2/3 → Group 4 → Group 5: the counts (259) and the changeset depend on all 18 icons being present.

**Critical path:**
Group 1 → Group 2 (largest slice, 13 icons) → Group 4 → Group 5

**Recommended implementation order:**
1. Implement Group 1 (tracer slice; stop and fix if `radar` output changes).
2. Implement Groups 2 and 3, either one after the other or together with a single shared build.
3. Implement Group 4 (completeness and additive-only checks).
4. Implement Group 5 (changeset, gate, PR description).
