# Visual Regression Testing

Visual regression tests capture screenshots of components and compare them against baseline images to detect unintended visual changes.

**Tests run in CI only.** All baselines are captured on Linux in CI to ensure consistency across the team.

## Structure

```
src/visual-regression/
├── lib/
│   ├── interactive-states.ts # Interactive state constants
│   ├── theme-modes.ts        # Theme mode utilities
│   └── types.ts              # TypeScript interfaces
├── mocks/
│   └── server-only.ts        # Mock for server components
└── vitest/
    ├── index.ts              # Barrel exports
    ├── setup.ts              # Style imports
    └── test-builder/
        ├── interactive.tsx   # Interactive state test builder
        └── static.tsx        # Static variant test builder

src/features/{component}/
├── {component}.visual.tsx    # Visual test file
└── __screenshots__/
    └── {component}.visual.tsx/
        └── {screenshot-name}-chromium-linux.png
```

## Updating Baselines

Use the **Update Visual Regression Snapshots** GitHub Action:

1. Go to the **Actions** tab in GitHub
2. Select **"Update Visual Regression Snapshots"** from the workflows list
3. Click **"Run workflow"** and select your feature branch
4. The workflow will regenerate all baselines and commit them to your branch

The workflow:
- Runs `visual:update` on Linux (matching CI environment)
- Commits updated screenshots with you as co-author
- Only works on feature branches (blocked on main)

## Running Tests

Run visual tests locally to verify changes before pushing:

```bash
pnpm visual        # Run all visual tests once
pnpm visual:update # Update baseline screenshots locally
```

**Note:** Local baselines may differ from CI due to OS/font rendering. Always use the GitHub Action for authoritative baseline updates.

## Choosing a Test Function

| Function | Use When |
|----------|----------|
| `createVisualTests` | Single screenshot showing all variants together |
| `createVisualTestScenarios` | Multiple screenshots, portals/modals, animations |
| `createInteractiveVisualTests` | Need hover, focus, pressed, disabled states |

## Writing Tests

### Simple Component (single screenshot)

```typescript
import { createVisualTests } from '~/visual-regression/vitest';
import { ButtonVariants } from './variants';

createVisualTests({
  componentName: 'Button',
  variantsComponent: ButtonVariants,
});
```

**Options:**
- `componentName` (required): Component name for test descriptions
- `variantsComponent` (required): React component rendering all variants
- `screenshotName` (optional): Custom filename (default: `{componentName}-variants.png`)

### Multiple Scenarios (separate screenshots)

```typescript
import { createVisualTestScenarios } from '~/visual-regression/vitest';

createVisualTestScenarios('Dialog', [
  {
    name: 'small variant',
    render: () => <DialogVariant size="small" />,
    screenshotName: 'dialog-small.png',
    selector: '[role="dialog"]',
    waitMs: 300, // Wait for animations before screenshot
  },
  {
    name: 'large variant',
    render: () => <DialogVariant size="large" />,
    screenshotName: 'dialog-large.png',
    selector: '[role="dialog"]',
    waitMs: 300,
  },
]);
```

**Scenario Options:**
- `name` (required): Test description
- `render` (required): Function returning React element
- `screenshotName` (required): Screenshot filename
- `selector` (optional): CSS selector to target specific element
  - Supports: `[role="..."]` and `[data-testid="..."]`
  - Other formats fall back to full container with a warning
- `waitMs` (optional): Delay before screenshot (for animations)

### Interactive States (hover, focus, pressed, disabled)

```typescript
import { createInteractiveVisualTests, generateVariantMatrix } from '~/visual-regression/vitest';
import type { ButtonProps } from '@accelint/design-toolkit/components/button/types';

const variants = generateVariantMatrix<ButtonProps>({
  dimensions: {
    variant: ['filled', 'outline'],
    color: ['accent', 'critical'],
    size: ['medium'],
  },
});

createInteractiveVisualTests({
  componentName: 'Button',
  renderComponent: (props) => <Button {...props}>Click me</Button>,
  testId: 'test-button',
  variants,
  states: ['default', 'hover', 'focus', 'pressed', 'disabled'],
});
```

**Config Options:**
- `componentName` (required): Component name
- `renderComponent` (required): `(props) => ReactNode`
- `variants` (required): Array of variant configs
- `states` (optional): States to test (default: all 5 states)
- `testId` (optional): Test ID for targeting (default: `test-{componentName}`)
- `beforeEach` (optional): Setup hook before each test
- `screenshotName` (optional): `(variant, state) => string` for custom naming

**Variant Options:**
- `id` (required): Unique identifier for screenshot names
- `name` (required): Human-readable test description
- `props` (required): Props to pass to component
- `states` (optional): Override states for this variant only
- `skip` (optional): Skip this variant entirely

**generateVariantMatrix Options:**
- `dimensions` (required): Object mapping prop names to arrays of values
- `baseProps` (optional): Props included in all generated variants
- `formatName` (optional): `(combination) => string` for custom naming

## How Tests Work

### Dual Theme Testing
All tests automatically run in both **dark** and **light** modes. Screenshot filenames include the mode suffix (e.g., `button-dark.png`, `button-light.png`).

### Interactive State Simulation
- **hover**: Simulated via `userEvent.hover()`
- **focus**: Finds first focusable element and calls `.focus()`
- **pressed**: Dispatches `mousedown` event for `:active` state
- **disabled**: Renders with `isDisabled: true` prop

### Smart Skipping
Interaction states (hover, focus, pressed) are automatically skipped for variants with `isDisabled: true`.

### State Reset
Between tests, the framework resets all state (blur, clear hover, release mouse) and waits for browser paint to complete.

## Available Exports

```typescript
import {
  // Test builders
  createVisualTests,
  createVisualTestScenarios,
  createInteractiveVisualTests,
  generateVariantMatrix,

  // Constants
  THEME_MODES,              // ['dark', 'light']
  INTERACTION_STATES,       // ['hover', 'focus', 'pressed']
  DEFAULT_TEST_STATES,      // ['default', 'hover', 'focus', 'pressed', 'disabled']
} from '~/visual-regression/vitest';
```

## Technology Stack

Visual regression testing is built on:

| Library | Purpose |
|---------|---------|
| [Vitest](https://vitest.dev/) | Test runner |
| [Vitest Browser Mode](https://vitest.dev/guide/browser/) | Runs tests in real browser, provides `page` and `userEvent` |
| [Playwright](https://playwright.dev/) | Browser automation provider (Chromium) |
| [vitest-browser-react](https://github.com/nicksrandall/vitest-browser-react) | React component rendering in browser |

Interactions (hover, focus) use Vitest's built-in `userEvent` from `vitest/browser`, not Testing Library.

## Configuration

Visual test configuration is in `vitest.config.js` under the `visual` project:

- **Browser:** Chromium (headless)
- **Viewport:** 1280x720
- **Device Scale Factor:** 1 (no DPI scaling)
- **Test Timeout:** 30 seconds
- **Setup:** `src/visual-regression/vitest/setup.ts`
