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

## Configuration

Visual test configuration is in `vitest.config.js` under the `visual` project:

- Browser: Chromium (headless)
- Viewport: 1280x720
- Setup: `src/visual-regression/vitest/setup.ts`
