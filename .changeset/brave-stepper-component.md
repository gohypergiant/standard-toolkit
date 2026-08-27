---
"@accelint/design-toolkit": minor
---

Add new Stepper component family for multi-step workflows with the following features:

- **Stepper**: Root context provider for state management
- **StepperList**: Container for step navigation with horizontal/vertical orientation
- **StepperStep**: Individual step button with current/visited/disabled states
- **StepperPanel**: Content panel with conditional rendering (unmounts inactive panels)
- **StepperBack/StepperNext**: Context-aware navigation buttons with auto-disabled boundaries
- **useStepperState**: Custom state hook with controlled/uncontrolled modes

Key capabilities:
- Controlled and uncontrolled state modes (`currentStep`/`defaultStep`)
- Bidirectional completion tracking (forward marks visited, backward removes visited state)
- Sequential and direct navigation with disabled step blocking
- Synchronous validation callback support (`onBeforeStepChange`)
- ARIA wizard pattern with keyboard navigation and live region announcements
- Flexible composition with separate list and panel positioning
- CSS Modules styling with design-foundation tokens and data attributes
- Key type consistency (string | number) matching Tabs pattern

Exports: `Stepper`, `StepperList`, `StepperStep`, `StepperPanel`, `StepperBack`, `StepperNext`, `useStepperState`
