## ADDED Requirements

### Requirement: Generate tokens using light-dark() function
The token generation script SHALL output CSS custom properties using the `light-dark()` function to combine light and dark theme values into a single declaration.

#### Scenario: Token with light and dark values
- **WHEN** the script processes a semantic token with both light and dark variants
- **THEN** it generates a single CSS variable using `light-dark(light-value, dark-value)` syntax

#### Scenario: Token with primitive fallbacks
- **WHEN** the script processes a token that references primitive variables
- **THEN** it includes fallback values for both light and dark modes in the format `light-dark(var(--light-ref, fallback), var(--dark-ref, fallback))`

### Requirement: Merge light and dark theme definitions
The token generation script SHALL walk both light and dark theme objects in parallel to merge corresponding tokens into unified declarations.

#### Scenario: Parallel token processing
- **WHEN** the script encounters matching tokens in both light and dark theme objects
- **THEN** it combines them into a single `light-dark()` declaration

#### Scenario: Nested token structures
- **WHEN** processing nested token objects (e.g., `bg.surface.default`)
- **THEN** it recursively merges nested structures while maintaining the hierarchy

### Requirement: Output simplified variant blocks
The generated CSS SHALL include `@variant` blocks that only set the `color-scheme` property instead of redefining all tokens.

#### Scenario: Dark variant output
- **WHEN** generating the dark variant block
- **THEN** it outputs `@variant dark { color-scheme: dark; }` without token definitions

#### Scenario: Light variant output
- **WHEN** generating the light variant block
- **THEN** it outputs `@variant light { color-scheme: light; }` without token definitions

### Requirement: Remove static theme block
The token generation script SHALL NOT generate an empty `@theme static` block for semantic tokens.

#### Scenario: Generated CSS structure
- **WHEN** the script completes token generation
- **THEN** the output does not contain a `@theme static` block with empty token declarations

### Requirement: Support color-scheme property
The theme provider SHALL set the CSS `color-scheme` property on the document element instead of toggling CSS classes.

#### Scenario: Theme activation via color-scheme
- **WHEN** a user toggles to dark mode
- **THEN** the provider sets `documentElement.style.colorScheme = 'dark'`

#### Scenario: Theme activation via color-scheme (light)
- **WHEN** a user toggles to light mode
- **THEN** the provider sets `documentElement.style.colorScheme = 'light'`