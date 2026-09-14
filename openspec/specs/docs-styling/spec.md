# Docs Styling

## Purpose

Visual styling system for the documentation website that applies design-toolkit aesthetic (outlines, spacing, typography) to fumadocs UI components via CSS overrides.

## ADDED Requirements

### Requirement: Sidebar links SHALL use outline-based active state

Active navigation links in the sidebar MUST use design-toolkit outlines instead of fumadocs' default border and background styling.

#### Scenario: Active link displays outline
- **WHEN** a sidebar navigation link is active (has `[data-active="true"]` attribute)
- **THEN** the link MUST display a 2px outline using `--outline-accent-primary-bold` color

#### Scenario: Fumadocs active indicator is hidden
- **WHEN** a sidebar navigation link is active
- **THEN** the fumadocs default `::before` indicator MUST be hidden (display: none)

#### Scenario: Active link has transparent background
- **WHEN** a sidebar navigation link is active
- **THEN** the background MUST be transparent (not filled)

### Requirement: Typography SHALL use design-toolkit scale

All text elements MUST use design-toolkit typography tokens for font sizes, line heights, and font families.

#### Scenario: Headings use display font
- **WHEN** rendering heading elements (h1-h6) in main content area
- **THEN** font-family MUST be `var(--font-family-display)`

#### Scenario: Headings use semantic size tokens
- **WHEN** rendering h1 elements
- **THEN** font-size MUST be `var(--text-size-header-h1)` and line-height MUST be `var(--text-line-height-header-h1)`

#### Scenario: Body text uses body font
- **WHEN** rendering prose content in main area
- **THEN** font-family MUST be `var(--font-family-body)`

#### Scenario: Body text uses semantic size tokens
- **WHEN** rendering paragraph elements
- **THEN** font-size MUST be `var(--text-size-body-l)` and line-height MUST be `var(--text-line-height-body-l)`

### Requirement: Spacing SHALL use semantic tokens

All spacing (padding, margin, gaps) MUST use design-toolkit semantic spacing tokens.

#### Scenario: Sidebar uses semantic gaps
- **WHEN** rendering sidebar navigation
- **THEN** gap between elements MUST use `var(--spacing-m)` or other semantic tokens (xs, s, l, xl, xxl)

#### Scenario: Main content uses semantic padding
- **WHEN** rendering main content area
- **THEN** padding MUST use semantic tokens like `var(--spacing-xl)` for horizontal and `var(--spacing-l)` for vertical

#### Scenario: Buttons use semantic spacing
- **WHEN** rendering button elements
- **THEN** padding MUST use `var(--spacing-s)` and `var(--spacing-m)` for inner spacing

### Requirement: Borders SHALL be converted to outlines

All border usage MUST be replaced with design-toolkit outlines.

#### Scenario: Interactive elements use outlines
- **WHEN** rendering elements with borders (buttons, inputs, cards)
- **THEN** border MUST be removed (border: none) and replaced with outline using `var(--outline-default)`

#### Scenario: Hover states use outline colors
- **WHEN** user hovers over an interactive element
- **THEN** outline-color MUST change to `var(--outline-hovered)`

#### Scenario: Focus states use outline colors
- **WHEN** an interactive element receives keyboard focus
- **THEN** outline MUST be 2px solid `var(--outline-focused)` with 2px offset

### Requirement: Styling SHALL preserve fumadocs functionality

CSS overrides MUST NOT break fumadocs responsive behavior, accessibility, or interactive features.

#### Scenario: Mobile header remains functional
- **WHEN** viewing on mobile breakpoint (< 768px)
- **THEN** mobile header MUST remain visible and functional

#### Scenario: Sidebar collapse works
- **WHEN** user toggles sidebar collapse
- **THEN** collapse animation and state MUST work correctly

#### Scenario: TOC popover works on mobile
- **WHEN** viewing on mobile/tablet (< 1280px)
- **THEN** TOC popover MUST open and close correctly

#### Scenario: Dark mode styles apply
- **WHEN** user toggles dark mode
- **THEN** all overrides MUST respect dark mode color tokens

### Requirement: Focus states SHALL meet WCAG 2.1 AA requirements

Focus indicators MUST be clearly visible and meet accessibility standards.

#### Scenario: Focus indicator has sufficient contrast
- **WHEN** an element receives keyboard focus
- **THEN** focus outline MUST have at least 3:1 contrast ratio with adjacent colors

#### Scenario: Focus indicator is visible
- **WHEN** an element receives keyboard focus
- **THEN** focus outline MUST be at least 2px thick and clearly visible

### Requirement: CSS overrides SHALL use layer L3

All styling overrides MUST be placed in the `@layer components.l3` block for proper specificity.

#### Scenario: Overrides are in correct layer
- **WHEN** CSS overrides are applied
- **THEN** they MUST be wrapped in `@layer components.l3 { }` block

#### Scenario: Overrides target grid areas
- **WHEN** selecting elements to style
- **THEN** selectors MUST use grid area attributes like `[grid-area:sidebar]` or data attributes like `[data-active="true"]`

### Requirement: Implementation SHALL modify only globals.css

All CSS overrides MUST be added to the existing `apps/docs/app/globals.css` file.

#### Scenario: No new files created
- **WHEN** implementing styling overrides
- **THEN** no new CSS files MUST be created

#### Scenario: Changes are in globals.css
- **WHEN** applying CSS overrides
- **THEN** all changes MUST be in `apps/docs/app/globals.css`

#### Scenario: No fumadocs files modified
- **WHEN** implementing styling
- **THEN** no files in fumadocs-ui package MUST be modified
