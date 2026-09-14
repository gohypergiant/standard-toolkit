## 1. Foundation: State Management & Context [PKG:design-toolkit]

- [x] 1.1 Create `packages/design-toolkit/src/components/stepper/` directory structure with types.ts defining StepperProps, StepperStepProps, StepperPanelProps using Key from @react-types/shared
  
  Test: TypeScript compiles without errors; Key type accepts string and number IDs

- [x] 1.2 Implement `use-stepper-state.ts` hook managing currentStep/defaultStep, Set-based step registration (register/unregister), completedSteps Set<Key> with bidirectional state management (forward navigation adds visited, backward removes all at or after destination, current never visited), and isFirstStep/isLastStep methods
  
  Test: Hook unit tests verify controlled/uncontrolled modes, step registration/unregistration, bidirectional completion tracking (forward adds visited, backward removes visited from destination and beyond), current step exclusion from visited set, and boundary detection

- [x] 1.3 Create `context.tsx` with StepperContext provider and useStepperContext hook exposing state and navigation methods
  
  Test: Hook throws error when called outside Stepper provider; context values are accessible to child components

## 2. Core Components: Stepper, StepperList, StepperStep [PKG:design-toolkit]

- [x] 2.1 Implement root `Stepper` component (stepper.tsx) as context provider accepting currentStep, defaultStep, onStepChange, onBeforeStepChange (synchronous boolean return), and orientation props
  
  Test: Component renders children and provides context; controlled/uncontrolled modes work; onBeforeStepChange synchronously blocks navigation when returning false

- [x] 2.2 Implement `StepperList` component (list.tsx) with role="navigation", aria-label="Steps", orientation support (horizontal/vertical), and keyboard navigation (arrow keys)
  
  Test: Arrow keys navigate between steps respecting orientation; focus wraps at boundaries; disabled steps are skipped

- [x] 2.3 Implement `StepperStep` component (step.tsx) with id prop, data attributes (data-current, data-visited, data-disabled) using CSS pseudo-classes for interactive states, click handler for direct navigation, and ARIA attributes (aria-current="step", aria-disabled)
  
  Test: Data attributes update based on state; data-visited only appears on past steps (not current); clicking step navigates to it; disabled steps block navigation; aria attributes are correct

## 3. Content Panels & Navigation Buttons [PKG:design-toolkit]

- [x] 3.1 Implement `StepperPanel` component (panel.tsx) with id prop, conditional rendering (only render when currentStep matches id, always unmount inactive panels), role="tabpanel", and aria-labelledby
  
  Test: Panel renders only when current; inactive panels are unmounted from DOM; ARIA attributes link to corresponding step

- [x] 3.2 Implement `StepperBack` and `StepperNext` components (back.tsx, next.tsx) with context-aware auto-disabled states at boundaries, synchronous validation callback support, and ARIA attributes
  
  Test: Back disabled at first step, Next disabled at last step; navigation synchronously respects onBeforeStepChange; buttons trigger correct state transitions

- [x] 3.3 Create component barrel `index.tsx` exporting all Stepper components and types
  
  Test: All exports are accessible; no TypeScript errors; pnpm index regenerates root src/index.ts successfully

## 4. Styling & Accessibility [PKG:design-toolkit]

- [x] 4.1 Create `styles.module.css` with @reference '@accelint/design-foundation/styles', @layer components.l1, data attribute selectors for step states, and orientation-based layout rules (horizontal/vertical)
  
  Test: Visual inspection in Storybook shows correct styling; data attributes target correct elements; orientation changes layout

- [x] 4.2 Implement ARIA live region in Stepper for screen reader announcements on step changes (e.g., "Step 2 of 3: Payment Details") and validation failures
  
  Test: Live region updates on navigation; screen reader announces step changes (manual testing with NVDA/JAWS)

- [x] 4.3 Add focus management: focus moves to panel content on navigation, focus restoration on dynamic step removal
  
  Test: Tab key flow is logical; focus moves to first focusable element in new panel after navigation; no focus loss on step unmount

## 5. Testing, Documentation & Stories [PKG:design-toolkit]

- [x] 5.1 Create comprehensive unit tests (stepper.test.tsx, use-stepper-state.test.ts) covering state transitions, navigation, disabled step blocking, bidirectional completion tracking (forward marks visited, backward removes visited from destination and beyond, current never visited), keyboard interaction, and synchronous validation callbacks
  
  Test: pnpm test passes with >90% coverage for stepper components; all scenarios from specs have corresponding tests; bidirectional visited state management verified; synchronous validation blocking confirmed

- [x] 5.2 Add comprehensive JSDoc to all exported functions/components with @param (including props.x), @returns, @throws, and @example fenced blocks showing controlled/uncontrolled usage, validation, and disabled steps
  
  Test: pnpm run audit:docblocks passes; documentation is complete and examples compile

- [x] 5.3 Create `stepper.stories.tsx` with stories: Basic Linear (3 steps, uncontrolled, Next/Back buttons with bidirectional visited state), Controlled (external state), Synchronous Validation Blocking (onBeforeStepChange returns false immediately), Non-Linear (dynamic disabled steps), Vertical Orientation, and state management demonstrations
  
  Test: All stories render in Storybook without errors; interactions work as expected; backward navigation removes visited state as expected; synchronous validation blocks navigation immediately; visual regression tests pass

## 6. Verification & Release [PKG:design-toolkit]

- [x] 6.1 Run full verification gate: pnpm build (fix any type errors), pnpm test (all tests pass), pnpm lint (no lint errors), pnpm format (formatting applied)
  
  Test: All gate commands pass without errors; design-toolkit builds successfully with new exports

- [x] 6.2 Create changeset with `pnpm changeset`: document new Stepper component family as MINOR version bump (new feature, backward compatible), list all new exports
  
  Test: Changeset file created in .changeset/; describes user-facing changes clearly; specifies minor bump for @accelint/design-toolkit

## Parallelization Strategy

### Sequential Dependencies

- **Slice 1** must complete before Slice 2 (context and state hook required by components)
- **Slice 2** must complete before Slice 3 (StepperStep required for panels to reference)
- **Slice 3** must complete before Slice 4 (components must exist before styling)

### Independent Tasks (Can Run in Parallel)

- Slices 4 and 5 are independent → styling/accessibility and testing/documentation can implement simultaneously after Slice 3 completes
- Within Slice 5: unit tests (5.1), JSDoc (5.2), and Storybook stories (5.3) can be worked on in parallel

### Critical Path

Slice 1 → Slice 2 → Slice 3 → (Slice 4 + Slice 5 in parallel) → Slice 6

### Recommended Implementation Order

1. Implement Slice 1 (foundation) - state management is the dependency for everything else
2. Implement Slice 2 (core components) - provides the basic structure
3. Implement Slice 3 (panels and navigation) - completes the component family
4. Implement Slices 4 and 5 in parallel - styling and testing are independent
5. Implement Slice 6 (verification) - final gate before release
