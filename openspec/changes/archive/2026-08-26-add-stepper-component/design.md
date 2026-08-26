---
change: add-stepper-component
specs_touched: [stepper-state-management, stepper-navigation, stepper-accessibility, stepper-styling, stepper-composition]
decisions:
  - id: D1
    choice: Custom useStepperState hook with collection state tracking
    rationale: No react-aria stepper primitive exists; stepper needs completion tracking and sequential constraints that Tabs doesn't provide; ViewStack registration pattern maps cleanly
    alternatives: [Extend useTabListState (requires forking react-aria internals), Manual useState (violates separation of concerns)]
  - id: D2
    choice: Key type with stepper-specific naming (currentStep/defaultStep/onStepChange)
    rationale: Maintains Key type consistency with Tabs/Menu for string/number support; domain-appropriate naming for position tracking vs selection; data-current attribute semantically correct
    alternatives: [Use selectedKey naming (semantically wrong for position), Numeric API with string IDs (inconsistent with Tabs)]
  - id: D3
    choice: Separate StepperBack/StepperNext components with context-aware disabled states
    rationale: Matches DrawerBack pattern; clearer semantics than action prop; auto-disabled at boundaries with consumer override support
    alternatives: [Single StepperButton with action prop (less discoverable), No navigation components (poor DX)]
  - id: D4
    choice: Track completed steps in Set<Key> updated on forward navigation
    rationale: Supports non-linear flows; O(1) lookup; only mark complete on forward nav; consumers control via onNext callback
    alternatives: [Boolean per step (requires external state), Array of numbers (O(n) lookup, brittle)]
  - id: D5
    choice: Disabled steps block navigation with no auto-skipping
    rationale: Matches Tabs behavior; auto-skipping introduces directional ambiguity; clear failure mode; research shows no auto-skip pattern exists
    alternatives: [Auto-skip to next enabled (ambiguous), Throw error (too aggressive)]
  - id: D6
    choice: ARIA wizard pattern with live region announcements
    rationale: Semantically correct for multi-step workflows; live regions for step transitions; arrow key navigation from react-aria; tabs pattern fallback if needed
    alternatives: [Pure div + ARIA (reinvents react-aria), No live regions (poor screen reader UX)]
  - id: D7
    choice: Conditional panel rendering (always unmount inactive panels)
    rationale: Performance win for heavy content; simpler API without state preservation complexity
    alternatives: [Render all with display none (wastes memory, breaks a11y), shouldForceMount prop (adds complexity for edge case)]
---

## Context

**Current State:**
design-toolkit provides ~20 RAC-based components (Button, Tabs, Menu, Dialog, etc.) in `packages/design-toolkit/src/components/`. No Stepper component exists. react-aria-components provides no stepper primitive (unlike Tabs which has `useTabListState`).

Reference components:
- **Tabs** (`components/tabs/`): uses react-aria's `useTabListState`, renders all tabs with conditional TabPanel display, supports `selectedKey`/`defaultSelectedKey`, keyboard navigation via arrow keys, `data-selected`/`data-disabled` attributes
- **ViewStack (Drawer)** (`components/drawer/view-stack.tsx`): custom state management with `Set` for registration, manual imperative API (`push`/`pop`/`replace`), DrawerBack renders `null` at first view

**Key Files:**
- `components/tabs/index.tsx` (TabList orchestration)
- `components/tabs/tab.tsx`, `components/tabs/panel.tsx` (Tab/TabPanel with ID matching)
- `components/tabs/context.tsx` (TabsContext for styling props only)
- `components/drawer/view-stack.tsx` (custom state management pattern)

**Desired End State:**
New `components/stepper/` directory with:
- `Stepper` (root context provider)
- `StepperList` (step navigation UI)
- `StepperStep` (individual step button)
- `StepperPanel` (step content container)
- `StepperBack`/`StepperNext` (navigation buttons)
- Custom `useStepperState` hook (no react-aria equivalent)
- Key-based step/panel matching (like Tabs with `selectedKey`/`id: Key`)
- Data attributes: `data-current`, `data-completed`, `data-disabled`
- CSS Modules styling with `@layer components.l1`
- Comprehensive JSDoc, tests, Storybook stories

## Goals / Non-Goals

**Goals:**
- Sequential multi-step workflow support with completion tracking
- Controlled (`currentStep`/`onStepChange`) and uncontrolled (`defaultStep`) modes
- Keyboard navigation (arrow keys) and accessibility (ARIA wizard pattern, live regions)
- Disabled step blocking (no auto-skipping)
- Synchronous validation callback (`onBeforeStepChange`) for navigation gating
- Horizontal/vertical orientation
- Storybook stories: basic linear, non-linear (skippable steps), validation blocking

**Non-Goals:**
- Branching/conditional workflows (implement via `disabledSteps` prop if needed)
- Built-in form integration (consumers wire up their own validation)
- Animated transitions (use CSS transitions on data attributes)
- Step/Panel mismatch validation (match Tabs behavior: no runtime checks)
- Dialog close blocking (no pattern exists in design-toolkit)

## Decisions

### Decision 1: State Management Pattern

**Choice:** Custom `useStepperState` hook with collection state tracking (like ViewStack), not react-aria's `useTabListState`.

**Rationale:**
- No react-aria stepper primitive exists
- Stepper needs completion tracking (Tabs doesn't)
- Need sequential navigation constraints (Tabs allows free clicking)
- Step registration pattern from ViewStack maps cleanly

**Alternatives Considered:**
- Extend `useTabListState`: would require forking/wrapping complex react-aria internals for sequential logic
- Manual useState in Stepper component: violates separation of concerns, harder to test

### Decision 2: Step Identification — Key Type with Stepper-Specific Naming

**Choice:** Use `Key` type (string | number) from `@react-types/shared`, but expose as `currentStep`/`defaultStep`/`onStepChange` for domain clarity.

**Rationale:**
- Maintains Key type consistency with Tabs/Menu (supports string | number)
- Domain-appropriate naming: "current step" not "selected key" (steppers track position, not selection)
- Supports both string IDs and numeric indices without conversion layer
- Step/StepPanel use `id: Key` prop for matching (like Tab/TabPanel)
- Data attribute: `data-current` (semantically correct for steppers vs `data-selected`)
- Research identified "numeric state with string IDs" as an inconsistency to avoid

**Alternatives Considered:**
- Use `selectedKey` naming: semantically wrong (steppers show current position, not user selection)
- Numeric `step: number` API with string IDs internally: inconsistent with Tabs, adds conversion layer
- Pure numeric indexing: brittle with conditional rendering, no stable IDs for a11y

**Implementation:**
```
// Public API
<Stepper currentStep="payment" onStepChange={(key: Key) => {}} />
<Stepper defaultStep={0} /> // numeric index also supported

// Step/Panel matching
<Step id="payment">Payment</Step>
<StepPanel id="payment">{/* content */}</StepPanel>

// Internal state
{ currentStep: Key, collection: Map<Key, StepNode>, completedKeys: Set<Key> }
```

### Decision 3: Navigation Button Pattern

**Choice:** Separate `StepperBack`/`StepperNext` components with context-aware disabled states (like DrawerBack), not a single `StepperButton` with `action` prop.

**Rationale:**
- Matches DrawerBack pattern (renders `null` at first view)
- Clearer semantics than `<StepperButton action="next" />`
- Auto-disabled at boundaries (first/last step)
- Consumers can override via `disabled` prop

**Alternatives Considered:**
- Single `StepperButton` with `action="next" | "back"`: less discoverable, harder to type correctly
- No navigation components (consumers use Stepper context directly): poor DX, no boundary handling

### Decision 4: Completion Tracking with Bidirectional State Management

**Choice:** Track visited steps in `Set<Key>`, managed bidirectionally based on navigation direction. `data-visited` attribute for styling. Forward navigation adds the departed step to visited; backward navigation removes all steps at or after the destination from visited. Current step is never in the visited set.

**Rationale:**
- Bidirectional management provides clear visual progress feedback and supports "undo" semantics
- Removing visited state on backward navigation prevents misleading completion indicators
- Current step exclusion ensures a step is either current OR visited, never both
- Supports non-linear flows (user can revisit steps)
- Set for O(1) lookup (like ViewStack)
- Consumers control navigation logic via synchronous `onBeforeStepChange` validation callback (returns boolean immediately, no async support)

**Alternatives Considered:**
- Boolean `isComplete` flag per step: requires external state management
- Array of completed step numbers: O(n) lookup, brittle with dynamic steps
- One-directional visited tracking only on forward: confusing UX when navigating backward (shows visited when user returned to edit)

### Decision 5: Disabled Step Behavior

**Choice:** Disabled steps block navigation (keyboard/click), no auto-skipping. Consumers must provide valid step indices.

**Rationale:**
- Matches Tabs behavior (disabled keys block selection)
- Auto-skipping introduces complexity (which direction? nested disabled ranges?)
- Research shows no auto-skipping pattern exists in design-toolkit
- Clear failure mode: navigation does nothing (vs silent skip to unknown step)

**Alternatives Considered:**
- Auto-skip to next enabled step: ambiguous with bidirectional nav, breaks sequential contract
- Throw error on disabled navigation: too aggressive, complicates consumer code

### Decision 6: Accessibility — ARIA Wizard vs Tabs

**Choice:** Use ARIA wizard pattern (if available in react-aria) or fall back to tabs pattern with step metadata in aria-label.

**Rationale:**
- Wizard pattern semantically correct for multi-step workflows
- Tabs pattern (role="tablist") is fallback if wizard not supported
- Live region announcements on step change (e.g., "Step 2 of 4: Payment")
- Arrow key navigation from react-aria keyboard utilities

**Alternatives Considered:**
- Pure div + ARIA: reinventing react-aria patterns, more maintenance
- No live regions: poor screen reader UX for step transitions

### Decision 7: Panel Rendering Strategy

**Choice:** Conditional rendering of active panel only (always unmount inactive panels).

**Rationale:**
- Avoids rendering unused panels (performance win for heavy content)
- Simpler API without state preservation complexity
- Consumers can lift state to parent if preservation needed
- Matches simplified component philosophy

**Alternatives Considered:**
- Render all panels with `display: none`: wastes memory/CPU, breaks a11y (all panels in tree)
- Add `shouldForceMount` prop: adds complexity for edge case that can be solved with lifted state

## Architecture

```
┌─────────────────────────────────────────┐
│          Stepper (root)                 │
│  - StepperContext provider              │
│  - useStepperState hook                 │
│  - Props: currentStep, defaultStep,     │
│    onStepChange, disabledKeys           │
└─────────┬───────────────────────────────┘
          │
    ┌─────┴─────────────────────────┐
    │                                │
┌───▼────────────────┐   ┌──────────▼─────────────┐
│   StepperList      │   │   StepperPanel         │
│  - Renders steps   │   │  - Conditional render  │
│  - Keyboard nav    │   │  - ID-based matching   │
│  - Orientation     │   │  - Unmounts inactive   │
└────┬───────────────┘   └────────────────────────┘
     │
┌────▼──────────────────────────┐
│  StepperStep (individual)     │
│  - data-current               │
│  - data-completed             │
│  - data-disabled              │
│  - Click handler              │
│  - Pseudo-class styling       │
└───────────────────────────────┘

Navigation Buttons (context-aware):
┌──────────────────┐  ┌──────────────────┐
│  StepperBack     │  │  StepperNext     │
│  - Auto-disabled │  │  - Auto-disabled │
│  - Validation    │  │  - Validation    │
└──────────────────┘  └──────────────────┘
```

**State Flow:**
```
1. Step registration (mount):
   Step mounts → calls context.register(key) → state.steps updated

2. Navigation forward:
   User clicks Next → synchronous validation passes → mark current as visited (add to completedSteps)
   → remove destination from visited (current is never visited)
   → onStepChange(nextKey) → panel updates

3. Navigation backward:
   User clicks Back → synchronous validation passes → remove all steps at or after destination from visited
   → onStepChange(prevKey) → panel updates
   (visited state cleared for destination and all steps after it)

4. Direct navigation (click step):
   User clicks Step → check disabled → synchronous validation passes
   → if forward: mark current as visited, remove destination from visited
   → if backward: remove all steps at or after destination from visited
   → onStepChange(targetKey) → panel updates

5. Keyboard navigation:
   Arrow keys → traverse step keys → skip disabled → same logic as direct navigation
```

## Patterns to Follow

**Reference Files:**
- `components/tabs/index.tsx` — TabList structure, `useTabListState` usage
- `components/tabs/tab.tsx` — ID-based matching, data attributes
- `components/tabs/panel.tsx` — conditional rendering pattern
- `components/tabs/context.tsx` — context provider pattern
- `components/drawer/view-stack.tsx` — Set-based registration, custom state management

**Key Patterns:**
- Component structure: `index.tsx` (barrel) + variant files (step.tsx, panel.tsx, etc.)
- Context: `StepperContext` with direct context consumption
- Styling: `styles.module.css` with `@layer components.l1` + data attributes + pseudo-classes
- State hook: `use-stepper-state.ts` returning `{ currentStep, onStepChange, registerStep, completedKeys, ... }`
- Types: `types.ts` with exported prop types (StepperProps, StepProps, etc.) using Key from @react-types/shared
- Simple className/style props (no render props)

## Patterns to Avoid

- tailwind-variants/cva for styling (use CSS Modules @layer)
- Arrow function components (use `export function`)
- Default exports (use named exports)
- Editing generated `src/index.ts` (run `pnpm index`)
- Syncing props to state (controlled/uncontrolled switch)
- Testing library internals (test behavior via public API)

## Storybook Stories

Create `stepper.stories.tsx` with:
1. **Basic Linear**: 3 steps, uncontrolled, Next/Back buttons, horizontal orientation
2. **Controlled**: Parent manages step state, external step indicator
3. **Synchronous Validation Blocking**: `onBeforeStepChange` synchronously returns false to block navigation
4. **Non-Linear**: Some steps disabled initially, enabled after completion
5. **Vertical Orientation**: `orientation="vertical"` prop

## Risks / Trade-offs

**[Risk] No react-aria stepper primitive → custom implementation diverges from design-toolkit patterns**
→ **Mitigation:** Follow Tabs structure closely, reuse react-aria keyboard/focus utilities, comprehensive accessibility testing

**[Risk] Step/Panel ID mismatch causes silent failure (no panel displays)**
→ **Mitigation:** Match Tabs behavior (no runtime validation), document ID matching requirement in JSDoc with examples

**[Risk] Synchronous validation may not fit async use cases (e.g., API validation)**
→ **Mitigation:** Consumers should perform async validation before navigation (e.g., disable Next button during validation) or lift validation state to parent component; synchronous validation keeps navigation predictable and matches design-toolkit patterns

**[Trade-off] Conditional panel rendering unmounts inactive panels (no state preservation)**
→ **Mitigation:** Consumers can lift state to parent component if preservation needed; simpler API overall

**[Trade-off] Key type supports both string and number, but consumers must ensure IDs match across Step/StepPanel**
→ **Mitigation:** Follow Tabs pattern exactly — document ID matching in JSDoc, no runtime validation (consistent with design-toolkit)

## Open Questions

No unresolved questions. Design follows established design-toolkit patterns with Tabs/ViewStack as references.
