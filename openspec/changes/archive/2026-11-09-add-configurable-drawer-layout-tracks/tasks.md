# Tasks

## 1. Approve the published contract

- [x] 1.1 [PKG:design-toolkit] Record explicit public-API approval for the optional placement-keyed DrawerLayout prop, including its name, the four supported placement keys, browser-resolved CSS grid-track grammar, CSS-wide-keyword policy, malformed-value behavior, semver-minor classification, and opt-in migration; this blocks all implementation tasks. Test: Review the recorded contract against `design.md` and `specs/drawer-layout-tracks/spec.md`, confirming it resolves every approval gate without adding parser or normalization behavior.

## 2. Deliver configurable open tracks

- [x] 2.1 [PKG:design-toolkit] Add the approved optional DrawerLayout configuration type and serialize only supplied placement values into dedicated configured-track custom properties, preserving existing callers and published entrypoints; run `pnpm indexer` rather than editing the generated root barrel. Depends on: 1.1. Test: Run the affected design-toolkit type check and confirm existing DrawerLayout usages compile without configuration while the approved configuration type accepts all four placements.

- [x] 2.2 [PKG:design-toolkit] Update DrawerLayout grid resolution so an open Drawer uses its configured placement track before the existing semantic size, while closed or absent placements settle to zero and same-placement Drawers keep their current shared-area behavior. Depends on: 2.1. Test: In a fixed browser container, parameterize top/right/bottom/left and assert computed `grid-template-columns` or `grid-template-rows` for configured values, unconfigured semantic fallback, no open Drawer, settled close, reopen, and concurrent same-placement Drawers.

- [x] 2.3 [PKG:design-toolkit] Preserve push-only main-content placement while making configured and semantic effective tracks resolve identically for push and overlay Drawers; preserve Drawer accessibility and Sidenav reservation behavior. Depends on: 2.2. Test: Assert computed tracks and main grid placement for configured push and overlay cases, and use user-facing assertions to confirm configured open/closed Drawers retain their accessible name, keyboard behavior, and visibility contract.

## 3. Document and demonstrate the approved contract

- [x] 3.1 [PKG:design-toolkit] Extend the existing Drawer and DrawerLayout stories with approved configured-track examples for all placements, partial configuration, semantic fallback, push, overlay, and same-placement bounds. Depends on: 2.3. Test: Run the package Storybook or story validation command and manually confirm the configured push and overlay examples show the documented reservation behavior.

- [x] 3.2 [PKG:apps/docs] [PKG:design-toolkit] Locate the existing Drawer API entry through `apps/docs/.index.json` and update the in-place generated API documentation with the approved prop signature, JSDoc, supported browser-resolved CSS grid-track examples, malformed-value behavior, opt-in migration, and accessibility/non-goals. Depends on: 1.1, 2.3. Test: Build the documentation app and verify the existing Drawer API page renders the updated signature and fenced examples without creating a parallel documentation tree.

- [x] 3.3 [PKG:apps/next] Add fixed-viewport visual cases to `apps/next/src/features/drawer/drawer.visual.tsx` for configured push and configured overlay tracks, including an open-close-open settled-state assertion. Depends on: 2.3. Test: Run the targeted Chromium visual test and verify its computed-track assertions and screenshots cover the configured cases.

## 4. Verify release readiness

- [x] 4.1 [PKG:design-toolkit] [PKG:apps/docs] [PKG:apps/next] Run the repository verification gate and add a minor changeset for the approved backward-compatible public API. Depends on: 3.1, 3.2, 3.3. Test: Run `pnpm run build`, `pnpm tsc --noEmit -p packages/design-toolkit/tsconfig.dist.json`, `pnpm run test`, `pnpm run lint`, and `pnpm run format`; confirm a changeset exists, generated files are intentional, and `openspec validate add-configurable-drawer-layout-tracks --strict` passes.

## Workflow follow-up

- Archive the change after implementation and review requirements are satisfied.
- Verify the archived result against the Drawer layout tracks specification.

## Parallelization Strategy

### Dependencies (Must Complete First)

- **Task 1.1** must complete before source, documentation, or visual work because it records the approved public contract and value grammar.
- **Tasks 2.1 → 2.2 → 2.3** are sequential: the type/serialization contract enables CSS resolution, which enables end-to-end push and overlay validation.

**Independent tasks (can run in parallel):**
- After Task 2.3, Tasks 3.1 (stories), 3.2 (API docs), and 3.3 (visual coverage) are independent and can be implemented simultaneously because they modify separate presentation, documentation, and app-test surfaces.

**Sequential dependencies:**
- Task 4.1 must follow Tasks 3.1–3.3 so the release gate validates the completed source, stories, docs, and visual coverage together.

**Critical path:**
Task 1.1 → Task 2.1 → Task 2.2 → Task 2.3 → Task 4.1

**Recommended implementation order:**
1. Record Task 1.1 approval and implement Tasks 2.1–2.3 in order.
2. Implement Tasks 3.1, 3.2, and 3.3 in parallel.
3. Complete Task 4.1 to run the verification gate and add the minor changeset.
