# PR Description Draft — add-land-defense-icons

Closes <!-- GitHub issue: unresolved -->

## Summary

Adds 18 additive `@accelint/icons` land and defense platform exports. The existing `radar`, `radar-site`, and `radar-anomaly` remain unchanged; the artifact's conflicting `radar` design is published as `mobile-radar`.

**Release classification:** `@accelint/icons` minor. No `@accelint/design-toolkit` Changeset entry was added because its catalog change is Storybook-only.

## Provenance and review status

- Source artifact: `land-icons-profile-review-rnd4.html` (footer date: **16 October 2026**).
- Figma source: file key `yMWadmpVp2WC6VAOpFQwqx`, page `44037:2`.
- Extracted artifact validation: `conformance.json` status `pass`.
- Review status: **design-review candidates; not validated by operator recognition testing**.
- The HTML artifact, extracted zip contents, and `.tickets/` remain uncommitted/untracked and are not part of this change.

## Catalog placement

Decision 8 is implemented: the 17 mobile platforms are in `'map dynamic'`; fixed `aegis-ashore` is in `'map static'`. The existing `symbols` entry continues to use `<Icon.Radar />`.

## Verification evidence

### Groups 1–4 recorded integration evidence

The completed OpenSpec tasks record the following results:

- All 18 SVG sources were copied byte-for-byte from the 24px `toolkit-24` artifact sources, with artifact `radar` renamed only to `mobile-radar`; no COP 32px input was copied.
- The generated package is complete at every layer: 259 source SVGs, 259 generated icon modules, 259 root icon exports, 261 `package.json` export keys (259 icons plus `.` and `./package.json`), and 259 each of `dist/*.js` and `dist/*.d.ts`.
- Baseline export entries and the existing radar-family sources/generated/built output were confirmed unchanged; the package diff is additive apart from the generated `src/icons/index.ts` and `package.json` additions.
- New sources contain neither `viewBox="0 0 32 32"` nor `#FF69B4`.
- The catalog contains each new name exactly once, and `packages/design-toolkit/dist` contains neither `MobileRadar` nor `TbmLauncher`, confirming that the Storybook catalog is excluded from its package build.

### Changeset status

`pnpm changeset status` completed successfully and reported:

```text
Packages to be bumped:
- minor
  - @accelint/constants
  - @accelint/formatters
  - @accelint/geo
  - @accelint/icons
  - @accelint/map-toolkit
- patch
  - @accelint/biome-config
  - @accelint/converters
  - @accelint/design-foundation
  - @accelint/design-toolkit
  - @accelint/ntds
  - @accelint/predicates
  - @accelint/smeegl
  - @accelint/stream
  - @accelint/stream-devtools
  - @accelint/temporal
```

`@accelint/icons` is therefore correctly computed as a minor bump; the pre-existing `chatty-stars-sleep.md` patch is subsumed. Changesets reports an automatic `@accelint/design-toolkit` patch; no design-toolkit entry was added manually.

`pnpm changeset` itself was invoked first, but its interactive selector cannot complete in this non-TTY harness and exited 13 after displaying its package-selection prompt. The resulting single change-specific file is `.changeset/land-defense-icons.md`, containing only `"@accelint/icons": minor` and the required one-line 18-icon summary.

### Repository gate and additional checks

| Command | Result | Evidence / notes |
| --- | --- | --- |
| `pnpm run build` | pass | Exit 0; Turbo reported 40 successful tasks. |
| `cd packages/design-toolkit && pnpm tsc --noEmit -p tsconfig.dist.json` | fail (pre-existing/unrelated) | Exit 2. The identical failures were reproduced in a clean temporary detached worktree at HEAD `6b078055`: `src/components/badge/types.ts:13` (missing `@react-types/overlays`), `media-controls/fullscreen-button.tsx:65`, `radio/group.tsx:60`, and `video/index.tsx:94-95`. None are files changed by this icon change. |
| `cd packages/map-toolkit && pnpm tsc --noEmit -p tsconfig.dist.json` | fail (pre-existing/unrelated) | Exit 2. The identical failure was reproduced in a clean temporary detached worktree at HEAD `6b078055`: `src/deckgl/base-map/types.ts:43`, `"projection"` is not assignable to `keyof MapOptions`. This file is outside the change. |
| `pnpm run test` | pass | Exit 0; Turbo reported 50 successful tasks. |
| `pnpm run lint` | pass | Exit 0; existing warnings were reported by design-toolkit but no lint failure. |
| `pnpm run format` | pass | Exit 0; no unexpected tracked diffs were introduced. |
| `pnpm run format:check` | pass | Exit 0; Turbo reported 79 successful tasks. |
| `pnpm run lint:deps` | pass | Exit 0: `No issues found`. |
| `pnpm run lint:package` | pass | Exit 0; Turbo reported 30 successful tasks. |
| `pnpm run lint:fs` | pass | Exit 0 in a clean temporary detached worktree at HEAD `6b078055`, excluding this checkout's untracked `.tickets/` and `land-icons-profile-review-rnd4.html`. |

An initial `pnpm tsc --noEmit -p tsconfig.dist.json` from the repository root (not the required package directory) also failed with `TS5058` because that path does not exist at the root; the two package-directory commands above are the authoritative attempted checks.

After `build` and `format`, `git status --short` showed only the expected Group 1–4 icon/catalog changes plus `.changeset/land-defense-icons.md`, this OpenSpec change directory, and the pre-existing/unrelated untracked `.tickets/` and artifact HTML. No generated tracked file outside the expected catalog, icon exports, and generated icon barrel changed.

**Gate state: satisfies task 5.3.** All required commands passed except the two authoritative package source typechecks; their failures were independently reproduced at clean detached HEAD `6b078055` and shown to be pre-existing and unrelated to this change. `lint:fs` passed in that clean worktree.

## Open questions

1. **Approval status:** unresolved — confirm that all 18 designs are approved for release.
2. **Final names:** unresolved — confirm `mobile-radar` and the abbreviated public ids.
3. **Release clearance:** unresolved — determine public-release/export-control and image-derivation clearance for the Apache-2.0 package.
4. **Figma publication:** unresolved — determine whether the 36 unpublished Figma components must be published before release.
5. **Supersession:** unresolved — determine whether earlier or later review rounds supersede RND4 designs.
6. **COP variants:** unresolved — determine whether a follow-up should add the 32px COP files to `@accelint/ntds`.

**PR readiness:** not ready. Open Questions 1–3 require recorded answers before the PR may be marked ready, despite the verification gate satisfying task 5.3.

## Pull Request Checklist

- [ ] Included link to corresponding GitHub Issue.
- [ ] Commit message follows Conventional Commits (no commit created in this task).
- [x] Added/updated tests or Storybook: Storybook catalog was updated; no committed test suite was added per Decision 9.
- [ ] Added/updated visual-regression tests: no catalog visual-regression coverage exists; manual review remains required.
- [ ] Added/updated documentation: no published documentation change is required for this additive icon release.
- [x] Filled out test instructions.
- [x] Added Changeset: `.changeset/land-defense-icons.md`.

## Test instructions

1. Resolve the Open Questions, especially 1–3, before marking ready.
2. Re-run the authoritative package typechecks as needed; their current failures are independently established as pre-existing/unrelated at clean detached HEAD `6b078055`. `lint:fs` passed in that clean worktree.
3. In Storybook, open `Foundation/Icons`; confirm the 17 mobile entries under `'map dynamic'`, `aegis-ashore` under `'map static'`, and the unchanged `radar` glyph under `symbols`.
4. Import a root icon and subpath icon, for example `Sm6` and `@accelint/icons/sm6`, and verify the titled SVG accessibility contract.

## Breaking change

- [ ] Yes
- [x] No

## AI usage

- [x] Apply the `ai` label when this draft is used to create a PR.
- [x] Implementation
- [x] Testing
- [x] Documentation

## Other information

No PR, commit, push, destructive cleanup, dependency change, root/tooling configuration change, or generated icon hand-edit was performed.
