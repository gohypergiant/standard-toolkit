## Why

design-toolkit needs a Stepper component to guide users through multi-step workflows (wizards, onboarding flows, multi-stage forms). No react-aria-components primitive exists for steppers, requiring a custom implementation following design-toolkit patterns.

## What Changes

- Add a new Stepper component family to `packages/design-toolkit/src/components/stepper/`
- New exports: `Stepper`, `StepperList`, `StepperStep`, `StepperPanel`, `StepperBack`, `StepperNext` components
- State management via custom hook (no react-aria equivalent exists)
- Keyboard navigation (arrow keys) and accessibility (ARIA roles, live regions)
- Data attributes for step states: `data-current`, `data-completed`, `data-disabled` for styling
- Sequential navigation with completion tracking
- Storybook stories demonstrating basic, linear, and non-linear flows
- Unit tests covering navigation, state transitions, keyboard interaction, and accessibility

## Capabilities

### New Capabilities
- `stepper-state-management`: Custom state hook managing current step, completion tracking, step registration, controlled/uncontrolled modes
- `stepper-navigation`: Navigation between steps with boundary handling (first/last), disabled step blocking, validation callbacks
- `stepper-accessibility`: ARIA roles, keyboard navigation (arrow keys), screen reader announcements via live regions
- `stepper-styling`: Data attributes for step states, CSS Modules integration, orientation support (horizontal/vertical)
- `stepper-composition`: Component family structure, context provider pattern, ID-based step/panel matching

### Modified Capabilities

None. This is a new component with no changes to existing design-toolkit capabilities.

## Impact

**Packages Touched:**
- `packages/design-toolkit` (new component family)

**Public API Additions:**
- New component exports in `@accelint/design-toolkit`
- No breaking changes (additive only)

**Dependencies:**
- Uses existing `react-aria` utilities (useId, keyboard handlers, focus management)
- Follows established design-toolkit patterns (Tabs component as reference)
- No new external dependencies

**Changeset Required:**
- **MINOR** version bump (new feature, backward compatible)
- Additive public API change to published package

**Downstream Impact:**
- No existing dependents affected (new component)
- Available for consumption in apps/next and external consumers after publish
