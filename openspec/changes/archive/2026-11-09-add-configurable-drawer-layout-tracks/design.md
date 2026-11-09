---
change: add-configurable-drawer-layout-tracks
created_at: "2026-11-06T18:22:30Z"
started_at: "2026-11-06T18:36:17Z"
completed_at: "2026-11-06T19:26:30Z"
specs_touched: [drawer-layout-tracks]
decisions:
  - id: D1
    choice: Use a placement-keyed optional DrawerLayout configuration.
    rationale: A partial record makes simultaneous different-placement configuration explicit while preserving current call sites.
    alternatives: [per-placement props, push-like string, Drawer-level prop]
  - id: D2
    choice: Keep CSS as the effective-track resolver.
    rationale: This preserves the current CSS transition and selector model while keeping closed configured tracks at zero.
    alternatives: [inline track overrides, JavaScript-computed templates, layout context]
  - id: D3
    choice: Treat supplied values as browser-resolved CSS track values.
    rationale: Verbatim strings support CSS tokens and functions without duplicating browser CSS parsing.
    alternatives: [numeric pixels only, custom validator, JavaScript normalization]
  - id: D4
    choice: Define effective size independently of push.
    rationale: This preserves overlay compatibility while push continues to govern only main-content grid placement.
    alternatives: [push-only configuration, push-specific grid templates]
  - id: D5
    choice: Retain deterministic existing same-placement behavior.
    rationale: Same-placement panels already share a grid area and arbitrary CSS track values have no established aggregation semantics.
    alternatives: [largest semantic size, summed tracks, reject duplicates]
---

# Design

## Public API Approval

**Approved:** 2026-11-06. Approval authorizes this backward-compatible, semver-minor `DrawerLayout` prop:

```ts
tracks?: Partial<Record<'top' | 'right' | 'bottom' | 'left', string>>
```

- Each supplied value is passed verbatim to browser CSS grid-track resolution; no parser, normalization, or runtime validation is added. Supported examples are `280px`, `22rem`, `minmax(18rem, 30vw)`, `var(--navigation-width)`, and `calc(...)`.
- CSS-wide keywords and malformed or unsupported strings are passed through; browser CSS error handling governs the result.
- A configured value wins over the semantic Drawer size only while a matching placement is open. Closed or absent placements settle to zero.
- Effective tracks resolve identically for push and overlay; `push` changes only main-content placement. Same-placement Drawers keep their shared-area, no-aggregation behavior.
- Adoption is opt-in. Existing callers remain compatible without migration.

## Current State

`DrawerLayout` in `packages/design-toolkit/src/components/drawer/layout.tsx` renders a three-column/three-row grid and carries `data-extend` and `data-push`. `layout-main.tsx` selects the main cell’s grid lines. `styles.module.css` defines all four `--drawer-*-size` variables as `0px`, constructs the grid templates, and uses `:has()` selectors to assign semantic Drawer sizes only while an open Drawer is present.

`Drawer` (`index.tsx`) sets `data-placement`, `data-size`, and `data-open` from ViewStack state. `DrawerContext` provides registration and placement, not layout-size state. Thus the existing data flow is CSS-driven:

```text
Drawer size + open state
        │ data-placement/data-size/data-open
        v
DrawerLayout :has(...) selector
        │ semantic fallback (100px | 200px | 400px)
        v
--drawer-<placement>-size ──> grid track ──> pushed main grid lines
```

A closed or absent Drawer matches no open selector and resolves to `0px`; a closed panel is `display:none`. CSS can interpolate a track during a close transition, but it has no exiting component lifecycle. `push` changes only `DrawerLayoutMain` placement and does not change track construction. Same-placement mounted Drawers share a grid area and their semantic-size selectors resolve by source order.

The related stories are `drawer.stories.tsx` and `layout.stories.tsx`; visual coverage is `apps/next/src/features/drawer/drawer.visual.tsx`. Existing tests verify Drawer close state, not computed tracks or configuration transitions. The 9.11.1 fix moved closed-track behavior into the CSS grid variables; it did not add a configurable API.

## Desired End State

DrawerLayout has an explicitly approved optional, placement-keyed public configuration for an open Drawer’s effective grid track. For a configured open placement, that value wins over Drawer’s semantic size. For an unconfigured placement, the current semantic fallback remains. Closed and absent Drawers retain `0px` tracks, and pushed main content follows the same effective track; overlay behavior remains unchanged.

No change is made to registration, ViewStack state, Drawer focus/keyboard/screen-reader behavior, Sidenav’s independent reservation, or the grid/animation architecture.

```text
DrawerLayout configured track (optional) ──> --drawer-<placement>-configured-size
                                                   │
open Drawer placement + semantic size ────────────┼──> effective track
                                                   │      configured ?? semantic
                                                   v
                                     grid template + pushed main placement
```

## Goals / Non-Goals

**Goals:**

- Preserve all four placement semantics and existing no-configuration behavior.
- Express configured values through per-placement CSS custom properties so CSS retains ownership of state transitions and grid layout.
- Establish behavioral coverage for every placement, partial configuration, no open Drawer, overlay/push, close/reopen, and concurrent same-placement Drawers.
- Demonstrate the API in existing Drawer and DrawerLayout Storybook stories and update the generated public Drawer documentation in place.

**Non-Goals:**

- Add a CSS parser, normalization layer, JavaScript placement state machine, or layout context.
- Change semantic Drawer `size`, force mounted panels to reserve space, or treat Sidenav width as Drawer configuration.
- Diagnose or fix the historical report unless a minimal 9.10.0 reproduction and current comparison meet the recorded evidence protocol.

## Patterns to Follow

- `packages/design-toolkit/src/components/drawer/layout.tsx`, `layout-main.tsx`, and `styles.module.css`: keep grid tracks, placement state, and pushed-main behavior in their present family.
- `packages/design-toolkit/src/components/drawer/types.ts`: define the public optional layout prop beside existing placement unions.
- `drawer.stories.tsx` and `layout.stories.tsx`: extend the established placement and mixed-layout examples rather than creating a parallel story family.
- `apps/next/src/features/drawer/drawer.visual.tsx`: add visual cases beside the existing placement captures.

## Patterns to Avoid

- Do not set the effective grid track directly from React inline styles; inline precedence would defeat CSS open-state selectors and closed-track behavior.
- Do not synchronize placement, open state, or track values into React state or extend `DrawerContext` for layout sizing.
- Do not hand-edit the generated package root `src/index.ts`; run the package index command when implementation changes exports.
- Do not change Drawer accessibility behavior while adding layout-only configuration.

## Resolved Decisions

### Decision 1: Use a placement-keyed optional DrawerLayout configuration

**Choice:** Subject to public-API approval, add one optional object prop keyed by the existing four placement literals. Each supplied value configures only its matching placement; omitted keys retain semantic behavior.

**Rationale:** A partial record makes simultaneous different-placement configuration explicit, avoids parsing the existing space-delimited `push` union, and preserves all current call sites.

**Alternatives Considered:** Per-placement props create a wider public surface; a string matching `push` cannot associate values safely; a Drawer-level prop conflates panel size with layout reservation.

### Decision 2: Keep CSS as the effective-track resolver

**Choice:** React serializes supplied placement values only into separate `--drawer-<placement>-configured-size` custom properties. Each existing open selector resolves its track as configured value first, otherwise the existing semantic preset; no open selector leaves its track at the `0px` default.

**Rationale:** This maintains today’s CSS transition and selector model, allows custom-property references, and prevents configured closed tracks from reserving space.

**Alternatives Considered:** Inline `--drawer-*-size` overrides CSS state resolution; JavaScript-computed templates duplicate CSS placement logic; context adds unnecessary state coupling.

### Decision 3: Treat supplied values as browser-resolved CSS track values

**Choice:** The approved prop uses a string value passed verbatim to its custom property; the public contract will name supported CSS grid-size grammar and browser behavior for malformed values rather than implement a new runtime parser.

**Rationale:** CSS custom-property references and functions are consumer requirements, and browser CSS parsing is the authoritative evaluator.

**Alternatives Considered:** Restricting to numeric pixels rejects tokens and responsive expressions; a custom validator cannot fully reproduce CSS grammar; silent JavaScript normalization would be undocumented behavior.

### Decision 4: Define effective size independently of push

**Choice:** Open configured and fallback tracks resolve identically for push and overlay. `push` continues to control only `DrawerLayoutMain` grid-line placement.

**Rationale:** This retains overlay compatibility and makes the configured size useful without coupling it to layout-main positioning.

**Alternatives Considered:** Apply configuration only for push, which makes overlay behavior surprising; mutate templates by push combination, which duplicates the four-track model.

### Decision 5: Retain deterministic existing same-placement behavior

**Choice:** The initial contract does not add multiple-Drawer aggregation or collision handling. A configured placement supplies one effective track when one or more same-placement Drawers are open; without configuration, current semantic-selector precedence remains.

**Rationale:** Same-placement panels already share a grid area, and combining arbitrary CSS track values has no established semantics.

**Alternatives Considered:** Largest semantic value changes existing behavior; summing tracks is visually and API-wise unsupported; rejecting duplicates changes mounting behavior.

## Accessibility

This is layout-only work. Drawer remains responsible for its existing rendered content and state attributes; the change must preserve keyboard operation, accessible names, focus behavior, and screen-reader output. Tests must verify that size configuration neither changes the open/closed content visibility contract nor adds or removes ARIA roles, focus management, or dismissal behavior.

## Validation Strategy

Component/browser tests must measure computed `grid-template-columns` and `grid-template-rows`, not implementation attributes alone. Parameterize top/right/bottom/left, configured and semantic fallback values, partial objects, closed/absent states, open-to-closed-to-open transitions after settling, push versus overlay, and same-placement bounds. Visual coverage adds configured pushed and overlay cases at the existing Chromium viewport.

Before calling the historical report a defect, record 9.10.0 and current/9.11.1+ package resolution, CSS, browser/viewport/root constraints, interaction/state, computed rows/columns, consumer CSS, and intentional Sidenav reservation.

## Risks / Trade-offs

- [A published prop lacks approval or an accepted name/grammar] → Do not implement or document it until approval records the semver-minor contract and migration is confirmed as opt-in.
- [Invalid consumer CSS resolves unexpectedly] → Document browser-resolved behavior and test supported examples; do not claim runtime validation.
- [CSS selector precedence obscures same-placement drawers] → Retain and document the bounded behavior; do not broaden the change into a collision system.
- [Computed-style tests are browser-sensitive] → Use a fixed test container and assert settled values separately from transition timing.

## Migration Plan

1. Obtain explicit approval for the public API, including prop name and supported CSS grammar.
2. Implement the optional prop and CSS fallback in `@accelint/design-toolkit`; existing callers require no changes.
3. Add tests, stories, visual coverage, API docs, and a minor changeset.
4. Release normally; rollback is removal from a pre-release or a patch that restores the fallback-only behavior, with no consumer migration needed for callers that never adopted the prop.

## Open Questions

No unresolved questions. Public API approval, exact prop naming, and supported CSS grammar are mandatory design-review gates recorded above; implementation must not proceed until they are explicitly approved.
