## ADDED Requirements

### Requirement: Sequential forward navigation
The StepperNext component SHALL advance to the next registered step in sequence when clicked, respecting the current step order from the registry.

#### Scenario: Navigate to next step in sequence
- **WHEN** current step is "step-1" and registered steps are ["step-1", "step-2", "step-3"]
- **THEN** clicking StepperNext advances to "step-2"

#### Scenario: Next navigation at last step
- **WHEN** current step is "step-3" and it is the last registered step
- **THEN** StepperNext is disabled and clicking it has no effect

#### Scenario: Next navigation with dynamically removed steps
- **WHEN** current step is "step-1", next step "step-2" unmounts, and registered steps become ["step-1", "step-3"]
- **THEN** clicking StepperNext advances directly to "step-3"

### Requirement: Sequential backward navigation
The StepperBack component SHALL navigate to the previous registered step in sequence when clicked.

#### Scenario: Navigate to previous step in sequence
- **WHEN** current step is "step-3" and registered steps are ["step-1", "step-2", "step-3"]
- **THEN** clicking StepperBack navigates to "step-2"

#### Scenario: Back navigation at first step
- **WHEN** current step is "step-1" and it is the first registered step
- **THEN** StepperBack is disabled and clicking it has no effect

#### Scenario: Back navigation with dynamically removed steps
- **WHEN** current step is "step-3", previous step "step-2" unmounts, and registered steps become ["step-1", "step-3"]
- **THEN** clicking StepperBack navigates directly to "step-1"

### Requirement: Disabled step blocking
The Stepper component SHALL block navigation to steps marked with `isDisabled={true}`, preventing both programmatic and user-triggered navigation to those steps. Disabled steps SHALL NOT be automatically skipped.

#### Scenario: Forward navigation blocked by disabled next step
- **WHEN** current step is "step-1", "step-2" has `isDisabled={true}`, and registered steps are ["step-1", "step-2", "step-3"]
- **THEN** StepperNext is disabled and clicking it has no effect (does not skip to "step-3")

#### Scenario: Backward navigation blocked by disabled previous step
- **WHEN** current step is "step-3", "step-2" has `isDisabled={true}`, and registered steps are ["step-1", "step-2", "step-3"]
- **THEN** StepperBack is disabled and clicking it has no effect

#### Scenario: Direct step click on disabled step
- **WHEN** a user clicks a StepperStep with `isDisabled={true}`
- **THEN** navigation does not occur and the current step remains unchanged

#### Scenario: Programmatic navigation to disabled step
- **WHEN** `onStepChange('disabled-step')` is called for a step with `isDisabled={true}`
- **THEN** the navigation is blocked and the current step remains unchanged

### Requirement: Direct step selection
Clicking a StepperStep component SHALL navigate directly to that step, bypassing intermediate steps in the sequence.

#### Scenario: Click any step to navigate
- **WHEN** current step is "step-1" and user clicks on "step-3"
- **THEN** navigation jumps directly to "step-3" without visiting "step-2"

#### Scenario: Click current step has no effect
- **WHEN** current step is "step-2" and user clicks on "step-2"
- **THEN** no state change occurs (current step remains "step-2")

#### Scenario: Click disabled step has no effect
- **WHEN** user clicks on a StepperStep with `isDisabled={true}`
- **THEN** navigation is blocked and current step does not change

### Requirement: Synchronous validation callback support
The Stepper component SHALL support an optional `onBeforeStepChange` synchronous validation callback that can block navigation by returning `false` (boolean). Async validation is NOT supported.

#### Scenario: Validation allows navigation
- **WHEN** user clicks StepperNext and `onBeforeStepChange(fromKey, toKey)` returns `true`
- **THEN** navigation proceeds immediately to the next step

#### Scenario: Validation blocks navigation
- **WHEN** user clicks StepperNext and `onBeforeStepChange('step-1', 'step-2')` returns `false`
- **THEN** navigation is blocked immediately and current step remains "step-1"

#### Scenario: Validation on backward navigation
- **WHEN** user clicks StepperBack and `onBeforeStepChange('step-3', 'step-2')` returns `false`
- **THEN** backward navigation is blocked immediately

### Requirement: Synchronous programmatic navigation
The Stepper component SHALL expose synchronous programmatic navigation methods via the state hook for external control (e.g., form submission triggers next step). All navigation methods are synchronous and return void.

#### Scenario: External trigger advances step
- **WHEN** external code calls `stepperState.next()` method
- **THEN** the stepper synchronously advances to the next step (subject to disabled/validation rules)

#### Scenario: External trigger navigates back
- **WHEN** external code calls `stepperState.previous()` method
- **THEN** the stepper synchronously navigates to the previous step (subject to disabled/validation rules)

#### Scenario: External trigger jumps to specific step
- **WHEN** external code calls `stepperState.goToStep('step-3')`
- **THEN** the stepper synchronously navigates directly to "step-3" (subject to disabled/validation rules)
