# Visual Regression Testing

Visual regression tests capture screenshots of components and compare them against baseline images to detect unintended visual changes.

**Tests run in CI only.** All baselines are captured on Linux in CI to ensure consistency across the team.

## Structure

```
src/visual-regression/
├── lib/
│   └── types.ts              # TypeScript interfaces
├── mocks/
│   └── server-only.ts        # Mock for server components
└── vitest/
    ├── setup.ts              # Style imports
    ├── test-builder.tsx      # Declarative test builders
    └── index.ts              # Barrel exports

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
  },
  {
    name: 'large variant',
    render: () => <DialogVariant size="large" />,
    screenshotName: 'dialog-large.png',
    selector: '[role="dialog"]',
  },
]);
```

## Configuration

Visual test configuration is in `vitest.config.js` under the `visual` project:

- Browser: Chromium (headless)
- Viewport: 1280x720
- Setup: `src/visual-regression/vitest/setup.ts`
