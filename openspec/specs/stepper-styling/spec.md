---
related: [stepper-accessibility, stepper-composition, stepper-navigation, stepper-state-management]
last_touched_by: add-stepper-component
last_touched_on: 2026-08-26
---

## Purpose

Defines styling requirements for Stepper components using CSS Modules, design-foundation tokens, data attributes, orientation support, and responsive patterns to enable flexible visual customization while maintaining accessibility.

## Related Specs

- stepper-accessibility
- stepper-composition
- stepper-navigation
- stepper-state-management

## Requirements

### Requirement: Data attributes for step states
Each StepperStep component SHALL expose data attributes for its current state to enable CSS-based styling without requiring JavaScript or class manipulation.

#### Scenario: Current step data attribute
- **WHEN** a step is the active/current step
- **THEN** it has `data-current="true"` attribute
- **AND** it does NOT have `data-visited` attribute (current and visited are mutually exclusive)

#### Scenario: Visited step data attribute
- **WHEN** a step has been visited (in the completedSteps set) and is not the current step
- **THEN** it has `data-visited="true"` attribute
- **AND** forward navigation adds steps to the visited set
- **AND** backward navigation removes all steps at or after the destination from the visited set

#### Scenario: Disabled step data attribute
- **WHEN** a step has `isDisabled={true}` prop
- **THEN** it has `data-disabled="true"` attribute

#### Scenario: Interactive state styling via pseudo-classes
- **WHEN** a step needs hover, focus, or active state styling
- **THEN** CSS uses standard pseudo-classes (`:hover`, `:focus`, `:active`) instead of data attributes for simpler styling

### Requirement: CSS Modules integration with design-foundation
Stepper components SHALL use CSS Modules with `@reference` to design-foundation and `@layer components.l1` for styling, following the established pattern in design-toolkit.

#### Scenario: Component styles use design-foundation tokens
- **WHEN** stepper styles are defined in `styles.module.css`
- **THEN** the file includes `@reference '@accelint/design-foundation/styles';` and uses tokens like `color-border-default`, `spacing-scale-4`

#### Scenario: Styles use component layer
- **WHEN** CSS rules are written for stepper components
- **THEN** they are wrapped in `@layer components.l1 { ... }`

#### Scenario: Data attribute selectors for state styling
- **WHEN** styling current, visited, or disabled steps
- **THEN** CSS uses attribute selectors like `[data-current="true"]`, `[data-visited="true"]`, `[data-disabled="true"]`

### Requirement: Orientation support
The Stepper component SHALL support both horizontal and vertical orientations via an `orientation` prop, affecting layout and keyboard navigation behavior.

#### Scenario: Horizontal orientation layout
- **WHEN** Stepper is rendered with `orientation="horizontal"` (default)
- **THEN** steps are laid out in a horizontal row and arrow key navigation uses Left/Right

#### Scenario: Vertical orientation layout
- **WHEN** Stepper is rendered with `orientation="vertical"`
- **THEN** steps are laid out in a vertical column and arrow key navigation uses Up/Down

#### Scenario: Orientation data attribute
- **WHEN** StepperList is rendered with a specific orientation
- **THEN** it has `data-orientation="horizontal"` or `data-orientation="vertical"` for CSS targeting

### Requirement: Visual progress indicators
The Stepper component SHALL support visual progress indicators (connecting lines, progress bars) between steps using CSS and data attributes.

#### Scenario: Step connector styling
- **WHEN** steps are rendered in StepperList
- **THEN** CSS can target connectors between steps using pseudo-elements (e.g., `.step:not(:last-child)::after` for horizontal lines)

#### Scenario: Visited step connectors
- **WHEN** a step is visited
- **THEN** its connector (line to next step) can be styled differently using `[data-visited="true"]::after` selector

#### Scenario: Progress percentage calculation
- **WHEN** 2 out of 5 steps are completed
- **THEN** CSS custom properties or inline styles can reflect `--progress: 40%` for a progress bar overlay

### Requirement: Responsive layout support
Stepper styling SHALL support responsive layout patterns, allowing orientation changes based on viewport size (e.g., horizontal on desktop, vertical on mobile).

#### Scenario: Responsive orientation via CSS
- **WHEN** StepperList is rendered with `orientation="horizontal"`
- **THEN** CSS media queries can override layout to vertical on small screens using `@container` or `@media` queries

#### Scenario: Adaptive step label visibility
- **WHEN** viewport width is narrow
- **THEN** CSS can hide step labels and show only step numbers using `.step-label { display: none; }` in media queries

#### Scenario: Stacked panels on mobile
- **WHEN** viewport is small and orientation is vertical
- **THEN** CSS can position StepperPanel below StepperList instead of beside it

### Requirement: Customizable styling surface
Stepper components SHALL accept standard React props (`className`, `style`) for consumer customization.

#### Scenario: Custom className application
- **WHEN** StepperStep is passed `className="custom-step"`
- **THEN** the rendered element has the custom class applied

#### Scenario: Inline style overrides
- **WHEN** Stepper is passed `style={{ padding: '2rem' }}`
- **THEN** the inline styles are applied

#### Scenario: Custom CSS variables
- **WHEN** consumer passes `style={{ '--step-color': 'blue' }}`
- **THEN** CSS Modules rules can reference `var(--step-color)` for theming
