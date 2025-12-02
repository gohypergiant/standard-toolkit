# MemLab Memory Leak Testing Infrastructure

This directory contains the infrastructure for automated memory leak detection in Design Toolkit components using MemLab and Playwright.

## Architecture Overview

```
src/memlab/
├── config/                    # Configuration files
│   ├── playwright.config.ts   # Playwright test configuration
│   ├── thresholds.json        # Component threshold definitions
│   └── .memlab-baseline.json  # Baseline data for regression tracking
├── filters/                   # Custom leak filters
│   ├── custom-filters.ts      # Filter implementations
│   └── index.ts               # Filter exports
├── hooks/                     # React hooks for test pages
│   └── use-stress-test.ts     # Stress test automation hook
├── lib/                       # Core library modules
│   ├── analyzer.ts            # Heap snapshot analysis
│   ├── baseline.ts            # Baseline management
│   ├── config.ts              # Configuration with env var support
│   ├── constants.ts           # Pre-compiled patterns and constants
│   ├── heap-snapshot.ts       # CDP snapshot collection
│   ├── html-report.ts         # HTML report generation
│   ├── sleep.ts               # Async sleep utility
│   ├── snapshot-cleanup.ts    # Old snapshot cleanup utility
│   ├── threshold-validator.ts # Threshold config validation
│   └── types.ts               # TypeScript type definitions
├── playwright/                # Shared test infrastructure
│   ├── fixtures.ts            # Playwright test fixtures
│   ├── test-builder.ts        # Declarative test builder
│   └── index.ts               # Barrel exports
├── reports/                   # Generated output
│   ├── html/                  # HTML report output
│   └── *.json                 # Per-component JSON reports
└── scripts/                   # Utility scripts
    └── generate-report.ts     # HTML report generation

src/features/{component}/      # Component feature folders
├── client.tsx                 # Client test harness
└── {component}.memlab.ts      # Playwright test file

src/app/{component}/client/    # Test page routes
└── page.tsx                   # Renders client test harness
```

## Three-Snapshot Model

MemLab uses a three-snapshot approach to detect memory leaks:

1. **Baseline Snapshot**: Captured after initial page load, before any test actions
2. **Target Snapshot**: Captured after performing the action being tested (e.g., opening a dialog)
3. **Final Snapshot**: Captured after cleanup (e.g., closing the dialog and forcing GC)

Memory that exists in the Target snapshot but not in the Final snapshot represents objects that were properly cleaned up. Memory that persists from Target to Final represents potential leaks.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  BASELINE   │     │   TARGET    │     │   FINAL     │
│  (clean)    │────▶│  (action)   │────▶│  (cleanup)  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                   │
                           └───────────────────┘
                             Objects retained here
                               = potential leaks
```

## Getting Started

### Running Tests

```bash
# Run all memory leak tests
pnpm memlab

# Run tests with visible browser
pnpm memlab:headed

# Run tests and update baselines
pnpm memlab:baseline

# Run tests in CI mode (JSON output)
pnpm memlab:ci

# Generate HTML report from last run
pnpm memlab:report
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MEMLAB_THRESHOLD_FILE` | `config/thresholds.json` | Path to threshold config |
| `MEMLAB_BASELINE_FILE` | `config/.memlab-baseline.json` | Path to baseline file |
| `MEMLAB_SNAPSHOT_DIR` | `/tmp/memlab-snapshots` | Directory for snapshots |
| `MEMLAB_REPORTS_DIR` | `src/memlab/reports` | Directory for reports |
| `MEMLAB_CLEANUP_SNAPSHOTS` | `true` | Auto-cleanup old snapshots |
| `MEMLAB_RETENTION_DAYS` | `7` | Days to retain snapshots |
| `UPDATE_BASELINE` | `false` | Update baseline with results |
| `DEBUG_MEMLAB` | `false` | Enable debug logging |
| `MEMLAB_USE_CUSTOM_FILTER` | `false` | Use custom leak filters |

## Adding Tests for a New Component

### 1. Create a Client Test Harness

Create a client test harness in `src/features/[component]/client.tsx`:

```tsx
'use client';

import { Button, YourComponent } from '@accelint/design-toolkit';
import { useStressTest } from '~/memlab/hooks/use-stress-test';

export function YourComponentMemlabTest() {
  const {
    isRunning,
    currentCycle,
    totalCycles,
    run: runStressTest,
    visible: showComponent,
    toggle: toggleComponent,
  } = useStressTest({ cycles: 10, delay: 25 });

  return (
    <div data-testid="memlab-yourcomponent-test">
      <Button data-testid="toggle-component" onPress={toggleComponent}>
        {showComponent ? 'Hide' : 'Show'}
      </Button>
      <Button data-testid="stress-test" onPress={runStressTest} isDisabled={isRunning}>
        {isRunning ? `Testing (${currentCycle}/${totalCycles})...` : 'Stress Test'}
      </Button>

      {showComponent && <YourComponent data-testid="component-container" />}
    </div>
  );
}
```

### 2. Create App Route

Create a page in `src/app/[component]/client/page.tsx`:

```tsx
import { YourComponentMemlabTest } from '~/features/yourcomponent/client';

export default function Page() {
  return <YourComponentMemlabTest />;
}
```

### 3. Create Test File

Create a test file in `src/features/[component]/[component].memlab.ts`:

```typescript
import { expect, forceGC, test, waitForCleanup } from '~/memlab/playwright/fixtures';

test.describe('YourComponent Memory Leak Tests', () => {
  test.use({ componentName: 'yourcomponent' });

  test('mount/unmount cycle should not leak memory', async ({
    page,
    collector,
    analyzeResult,
  }) => {
    await page.goto('/yourcomponent/client');
    await page.waitForSelector('[data-testid="memlab-yourcomponent-test"]');

    await forceGC(page);
    await waitForCleanup(page);

    // BASELINE
    await collector.takeSnapshot(page, 'baseline', 'before-action');

    // TARGET - perform action
    await page.click('[data-testid="toggle-component"]');
    await page.click('[data-testid="toggle-component"]');
    await waitForCleanup(page);
    await collector.takeSnapshot(page, 'target', 'after-action');

    // FINAL - cleanup
    await forceGC(page);
    await waitForCleanup(page);
    await collector.takeSnapshot(page, 'final', 'after-cleanup');

    const result = await analyzeResult();
    expect(result.passed).toBe(true);
  });
});
```

### 4. Configure Thresholds

Add component-specific thresholds in `config/thresholds.json`:

```json
{
  "components": {
    "yourcomponent": {
      "maxLeakedObjects": 0,
      "maxRetainedSize": 102400,
      "notes": "Description of expected behavior"
    }
  }
}
```

## Custom Leak Filters

Custom filters help identify framework-specific leaks. Available filters:

- **`fiberNodeFilter`**: Detects React Fiber node leaks
- **`busSubscriptionFilter`**: Detects @accelint/bus subscription leaks
- **`portalLeakFilter`**: Detects portal container leaks
- **`contextLeakFilter`**: Detects React context leaks
- **`designToolkitFilter`**: Combined filter for all design toolkit patterns

Enable custom filters with `MEMLAB_USE_CUSTOM_FILTER=true`.

## Threshold Configuration

### Structure

```json
{
  "global": {
    "maxLeakedObjects": 0,
    "maxRetainedSize": 1048576,
    "notes": "Default settings"
  },
  "components": {
    "component-name": {
      "maxLeakedObjects": 2,
      "maxRetainedSize": 524288,
      "notes": "Component-specific notes",
      "knownIssues": ["Issue description"]
    }
  }
}
```

### Threshold Values

- **`maxLeakedObjects`**: Maximum number of leaked objects allowed (integer)
- **`maxRetainedSize`**: Maximum retained memory in bytes
  - `10240` = 10 KB (strict)
  - `102400` = 100 KB (normal)
  - `524288` = 512 KB (relaxed)
  - `1048576` = 1 MB (lenient)

## Baseline Regression Tracking

Baselines track memory behavior over time:

```bash
# Update baseline after verified improvements
UPDATE_BASELINE=true pnpm memlab

# View baseline comparison
pnpm memlab  # Shows delta from baseline
```

## Troubleshooting

### Tests Timing Out

- Increase Playwright timeout in `playwright.config.ts`
- Check if the component takes longer to mount/unmount
- Verify the test page is accessible

### False Positives

- Increase `waitForCleanup()` duration
- Add multiple GC cycles before final snapshot
- Consider adding the pattern to custom filters

### CDP Connection Failures

- Ensure Chrome is properly launched
- Check if `--js-flags=--expose-gc` is set in Playwright config
- Verify no other process is using the debug port

### No Leaks Detected (When Expected)

- Run the intentional-leak tests to verify detection works
- Check if V8 optimization is hiding closures
- Enable debug mode: `DEBUG_MEMLAB=1 pnpm memlab`

## Report Output

After running tests, reports are generated in `src/memlab/reports/`:

- **JSON Reports**: Per-component results (`button.json`, `dialog.json`, etc.)
- **HTML Report**: Visual summary at `html/index.html` or run `pnpm memlab:report`

Each JSON report contains:
- `component`: Component name
- `timestamp`: When the test ran
- `leakCount`: Number of detected leaks
- `totalRetainedSize`: Total memory retained
- `passed`: Whether it met thresholds
- `leaks`: Array of leak details

## Performance Tips

1. **Threshold Caching**: Thresholds are cached after first load
2. **Pre-compiled Patterns**: Regex patterns are compiled once at module load
3. **Async I/O**: File operations use async APIs where possible
4. **Snapshot Cleanup**: Old snapshots are automatically cleaned up

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Add appropriate thresholds
3. Document any known issues
4. Run the full test suite before committing
