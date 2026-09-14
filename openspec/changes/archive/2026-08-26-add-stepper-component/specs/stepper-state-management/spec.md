## ADDED Requirements

### Requirement: Controlled and uncontrolled step state
The Stepper component SHALL support both controlled and uncontrolled state modes using `currentStep`/`onStepChange` (controlled) or `defaultStep` (uncontrolled) props, following the pattern established by Tabs with `selectedKey`/`defaultSelectedKey`.

#### Scenario: Uncontrolled stepper with default step
- **WHEN** Stepper is rendered with `defaultStep="step-2"` and no `currentStep` prop
- **THEN** the internal state initializes to "step-2" and updates occur internally on navigation

#### Scenario: Controlled stepper with external state
- **WHEN** Stepper is rendered with `currentStep={externalState}` and `onStepChange={(key) => setExternalState(key)}`
- **THEN** all step changes are reported via `onStepChange` and the component reflects the `currentStep` prop value

#### Scenario: Switching from uncontrolled to controlled
- **WHEN** a Stepper starts with `defaultStep` and later receives a `currentStep` prop
- **THEN** the component switches to controlled mode and ignores its internal state

### Requirement: Step registration and dynamic step lists
The Stepper component SHALL maintain a registry of available steps using Set-based registration (register/unregister pattern) similar to ViewStack, allowing steps to be added or removed dynamically.

#### Scenario: Step registration on mount
- **WHEN** a StepperStep component with `id="step-1"` mounts inside a Stepper
- **THEN** "step-1" is added to the internal step registry

#### Scenario: Step unregistration on unmount
- **WHEN** a StepperStep component with `id="step-2"` unmounts
- **THEN** "step-2" is removed from the internal step registry

#### Scenario: Dynamic step list with conditional rendering
- **WHEN** steps are conditionally rendered (e.g., `{showOptionalStep && <StepperStep id="optional">}`)
- **THEN** the step registry updates immediately and navigation respects the current set of registered steps

### Requirement: Completion tracking
The Stepper component SHALL track which steps have been visited (completed) using a `Set<Key>` stored in state, with programmatic control via `completedSteps` (controlled) or `defaultCompletedSteps` (uncontrolled) props. The visited state SHALL be managed bidirectionally: forward navigation marks steps as visited, backward navigation removes visited state from all steps at or after the destination.

#### Scenario: Marking step as visited on forward navigation
- **WHEN** user navigates forward from "step-1" to "step-2" via StepperNext
- **THEN** "step-1" is added to the completed steps set and displays `data-visited="true"`
- **AND** "step-2" becomes current and does NOT have `data-visited` (current step is never visited)

#### Scenario: Removing visited state on backward navigation
- **WHEN** user navigates backward from "step-3" to "step-2" via StepperBack
- **THEN** all steps at or after "step-2" (including "step-2" and "step-3") are removed from the completed steps set
- **AND** only steps before "step-2" (e.g., "step-1") retain `data-visited="true"`

#### Scenario: Current step is never marked as visited
- **WHEN** a step becomes the current step via any navigation method
- **THEN** that step is removed from the completed steps set
- **AND** the step does NOT have `data-visited` attribute

#### Scenario: Controlled completion tracking
- **WHEN** Stepper is rendered with `completedSteps={externalSet}` prop
- **THEN** the component reflects the external completion state and does not modify it internally

#### Scenario: Pre-completed steps on initialization
- **WHEN** Stepper is rendered with `defaultCompletedSteps={new Set(['step-1', 'step-2'])}`
- **THEN** "step-1" and "step-2" are marked as completed and display `data-visited="true"`
- **AND** the current step is excluded from the visited set if it was in the default set

### Requirement: Step order and boundary detection
The state hook SHALL maintain the order of registered steps and provide methods to determine if the current step is the first or last in the sequence.

#### Scenario: First step detection
- **WHEN** current step is "step-1" and it is the first registered step
- **THEN** `isFirstStep()` returns `true` and StepperBack is disabled

#### Scenario: Last step detection
- **WHEN** current step is "step-3" and it is the last registered step
- **THEN** `isLastStep()` returns `true` and StepperNext is disabled or shows "Finish" text

#### Scenario: Step order changes due to dynamic registration
- **WHEN** steps are registered in order ["step-1", "step-3"] and "step-2" is dynamically added between them
- **THEN** the step order becomes ["step-1", "step-2", "step-3"] and navigation respects the new sequence

### Requirement: Key type consistency
The Stepper component SHALL use `Key` type (string | number) for step identifiers, matching the pattern from Tabs and react-aria state management hooks.

#### Scenario: String step identifiers
- **WHEN** steps are defined with string ids: `id="personal-info"`, `id="payment-details"`
- **THEN** state management accepts and tracks these keys as strings

#### Scenario: Numeric step identifiers
- **WHEN** steps are defined with numeric ids: `id={1}`, `id={2}`
- **THEN** state management accepts and tracks these keys as numbers

#### Scenario: Mixed key types in the same stepper
- **WHEN** steps use mixed types: `id="intro"`, `id={2}`, `id="conclusion"`
- **THEN** state management handles all keys correctly without type coercion errors
