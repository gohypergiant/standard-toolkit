---
related: [stepper-accessibility, stepper-navigation, stepper-state-management, stepper-styling]
last_touched_by: add-stepper-component
last_touched_on: 2026-08-26
---

## Purpose

Defines the component family structure, context provider pattern, ID-based matching, and composition patterns for Stepper components following design-toolkit conventions from Tabs and ViewStack.

## Related Specs

- stepper-accessibility
- stepper-navigation
- stepper-state-management
- stepper-styling

## Requirements

### Requirement: Component family structure
The Stepper component SHALL follow design-toolkit's component family pattern with a root provider, list container, individual step components, panel components, and navigation buttons.

#### Scenario: Root Stepper provider component
- **WHEN** a Stepper component is rendered
- **THEN** it provides context for state management (currentStep, completedSteps, navigation methods) to all descendant components

#### Scenario: StepperList contains StepperStep children
- **WHEN** a StepperList component is rendered with StepperStep children
- **THEN** each child registers itself with the stepper state and receives current/completed/disabled status

#### Scenario: StepperPanel keyed to step ID
- **WHEN** a StepperPanel with `id="step-1"` is rendered
- **THEN** it displays its content only when currentStep is "step-1"

#### Scenario: Navigation buttons (StepperBack/StepperNext)
- **WHEN** StepperBack and StepperNext components are rendered
- **THEN** they consume stepper context to enable/disable themselves and trigger navigation

### Requirement: Context provider pattern
The Stepper component SHALL use React Context to distribute state and callbacks to descendant components, following the pattern from Tabs (TabsContext).

#### Scenario: State consumed via useStepperContext
- **WHEN** a child component calls `useStepperContext()`
- **THEN** it receives `{ currentStep, completedSteps, register, unregister, next, previous, goToStep, isDisabled }`

#### Scenario: Context unavailable outside Stepper tree
- **WHEN** a component calls `useStepperContext()` outside a Stepper provider
- **THEN** an error is thrown with message "useStepperContext must be used within a Stepper component"

#### Scenario: Direct context consumption
- **WHEN** StepperStep consumes context via `useStepperContext()`
- **THEN** it accesses state and methods directly from context

### Requirement: ID-based step and panel matching
StepperStep and StepperPanel components SHALL use `id` props to associate steps with their corresponding content panels, with automatic ID generation via `useId` when omitted.

#### Scenario: Explicit ID matching
- **WHEN** `<StepperStep id="payment">` and `<StepperPanel id="payment">` are rendered
- **THEN** the panel displays when currentStep is "payment"

#### Scenario: Auto-generated IDs
- **WHEN** StepperStep is rendered without an `id` prop
- **THEN** `useId()` generates a stable unique ID for the step

#### Scenario: Mismatched IDs
- **WHEN** a StepperPanel has `id="checkout"` but no StepperStep with that ID exists
- **THEN** the panel never displays (console warning in development mode)

### Requirement: Conditional panel rendering
StepperPanel components SHALL render their content only when their ID matches the current step. Inactive panels are unmounted from the DOM.

#### Scenario: Conditional rendering (always unmounts)
- **WHEN** currentStep is "step-1" and a StepperPanel has `id="step-2"`
- **THEN** the "step-2" panel content is not rendered (null return)

#### Scenario: State preservation via lifted state
- **WHEN** a form input in a panel needs to persist values across navigation
- **THEN** consumer lifts state to parent component outside the panel

### Requirement: Flexible composition and layout
Stepper components SHALL support flexible composition patterns, allowing StepperList and panels to be positioned independently (e.g., list on left, panels on right).

#### Scenario: Separate list and panel containers
- **WHEN** StepperList is rendered in one container and StepperPanel components in another
- **THEN** context sharing works across separate DOM subtrees within the same Stepper provider

#### Scenario: Multiple panels for the same step
- **WHEN** two StepperPanel components have the same `id="step-1"`
- **THEN** both panels display when currentStep is "step-1"

#### Scenario: Custom layout wrapper components
- **WHEN** a consumer wraps StepperList and StepperPanel in custom layout divs
- **THEN** stepper functionality is unaffected (context propagates through intermediary components)

### Requirement: Render props and composition utilities
Stepper components SHALL use `composeRenderProps` for className/children merging and support render props patterns for advanced customization.

#### Scenario: className function composition
- **WHEN** StepperStep receives `className={(state) => state.isCurrent ? 'active' : 'inactive'}`
- **THEN** the function receives state object with `{ isCurrent, isCompleted, isDisabled }` and result is merged with default classes

#### Scenario: children render prop access to state
- **WHEN** StepperStep receives `children={(state) => <>{state.isCurrent ? '✓' : state.stepNumber}</>}`
- **THEN** the render function receives step state for conditional rendering

#### Scenario: Slotted children
- **WHEN** Stepper contains slotted children like `<StepperIcon>` or `<StepperLabel>`
- **THEN** slotted components receive context via `useContextProps` and merge with local props

### Requirement: Component exports and barrel structure
Stepper components SHALL be exported as named exports from `packages/design-toolkit/src/components/stepper/index.tsx` (hand-curated barrel) and included in the generated root `src/index.ts`.

#### Scenario: Named exports from barrel
- **WHEN** consumer imports stepper components
- **THEN** they use `import { Stepper, StepperList, StepperStep, StepperPanel, StepperBack, StepperNext } from '@accelint/design-toolkit'`

#### Scenario: Hook export
- **WHEN** consumer needs direct state hook access for advanced use cases
- **THEN** `useStepperState` is exported alongside components

#### Scenario: Type exports
- **WHEN** consumer needs TypeScript types
- **THEN** `StepperProps`, `StepperStepProps`, `StepperPanelProps` types are exported from the barrel
