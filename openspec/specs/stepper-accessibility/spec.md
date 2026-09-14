---
related: [stepper-composition, stepper-navigation, stepper-state-management, stepper-styling]
last_touched_by: add-stepper-component
last_touched_on: 2026-08-26
---

## Purpose

Defines accessibility requirements for Stepper components including ARIA patterns, keyboard navigation, screen reader announcements, and focus management to ensure keyboard-only and assistive technology users can navigate multi-step workflows.

## Related Specs

- stepper-composition
- stepper-navigation
- stepper-state-management
- stepper-styling

## Requirements

### Requirement: ARIA wizard pattern
The Stepper component SHALL implement the ARIA wizard pattern with appropriate roles and attributes for screen reader compatibility.

#### Scenario: Stepper container has wizard role
- **WHEN** a Stepper component is rendered
- **THEN** the root element has `role="group"` with `aria-label` describing the wizard (e.g., "Multi-step registration wizard")

#### Scenario: StepperList has navigation role
- **WHEN** a StepperList component is rendered
- **THEN** the container element has `role="navigation"` with `aria-label="Steps"`

#### Scenario: StepperStep has tab-like semantics
- **WHEN** a StepperStep component is rendered
- **THEN** it has `role="button"` with `aria-current="step"` when active and `aria-disabled="true"` when disabled

#### Scenario: StepperPanel has tabpanel semantics
- **WHEN** a StepperPanel component is rendered
- **THEN** it has `role="tabpanel"` with `aria-labelledby` pointing to the corresponding step's id

### Requirement: Keyboard navigation with arrow keys
The StepperList component SHALL support keyboard navigation between steps using Left/Right (horizontal) or Up/Down (vertical) arrow keys, matching the component's orientation.

#### Scenario: Horizontal stepper arrow key navigation
- **WHEN** StepperList has `orientation="horizontal"` (default) and a step has focus
- **THEN** Right arrow moves focus to next step, Left arrow moves focus to previous step

#### Scenario: Vertical stepper arrow key navigation
- **WHEN** StepperList has `orientation="vertical"` and a step has focus
- **THEN** Down arrow moves focus to next step, Up arrow moves focus to previous step

#### Scenario: Arrow key focus wrapping
- **WHEN** focus is on the last step and Right/Down arrow is pressed
- **THEN** focus wraps to the first step (circular navigation)

#### Scenario: Arrow key navigation skips disabled steps
- **WHEN** navigating with arrow keys and the next step is disabled
- **THEN** focus moves to the next non-disabled step in the direction

#### Scenario: Enter/Space activates focused step
- **WHEN** a step has keyboard focus and Enter or Space is pressed
- **THEN** the stepper navigates to that step (same behavior as clicking)

### Requirement: Screen reader announcements via live regions
The Stepper component SHALL announce step changes to screen readers using ARIA live regions with polite priority.

#### Scenario: Announce step change
- **WHEN** user navigates from "step-1" to "step-2" 
- **THEN** an `aria-live="polite"` region announces "Step 2 of 3: Payment Details"

#### Scenario: Announce completion status
- **WHEN** user completes a step by navigating forward
- **THEN** the live region announces "Step 1 completed" followed by the next step announcement

#### Scenario: Announce validation failure
- **WHEN** navigation is blocked by validation and `onBeforeStepChange` returns `false`
- **THEN** the live region announces "Navigation blocked. Please complete the required fields."

#### Scenario: Announce disabled step interaction
- **WHEN** user attempts to navigate to a disabled step
- **THEN** the live region announces "This step is currently unavailable"

### Requirement: Focus management
The Stepper component SHALL manage focus appropriately during navigation to ensure keyboard users can continue interaction without manual focus restoration.

#### Scenario: Focus moves to panel content on navigation
- **WHEN** user navigates to a new step via keyboard or click
- **THEN** focus moves to the first focusable element in the new StepperPanel

#### Scenario: Focus remains on navigation buttons after boundary hit
- **WHEN** user clicks StepperNext at the last step (button is disabled)
- **THEN** focus remains on the StepperNext button and does not move unexpectedly

#### Scenario: Focus restoration after dynamic step removal
- **WHEN** the current step is dynamically removed and fallback step is shown
- **THEN** focus moves to the fallback step's panel or the first focusable element

### Requirement: Semantic step state indicators
Each StepperStep SHALL expose its state (current, completed, disabled) via both ARIA attributes and data attributes for programmatic inspection and styling.

#### Scenario: Current step indicators
- **WHEN** a step is the current active step
- **THEN** it has `aria-current="step"` and `data-current="true"`

#### Scenario: Completed step indicators
- **WHEN** a step has been completed
- **THEN** it has `aria-checked="true"` (if using checkbox semantics) or `data-completed="true"`

#### Scenario: Disabled step indicators
- **WHEN** a step is disabled
- **THEN** it has `aria-disabled="true"` and `data-disabled="true"`

#### Scenario: Step count announcement
- **WHEN** a step is focused
- **THEN** screen readers announce "Step X of Y: [Step Label]" via `aria-label` or `aria-labelledby`
