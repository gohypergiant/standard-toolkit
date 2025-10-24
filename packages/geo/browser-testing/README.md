# Browser Compatibility Testing

This directory contains browser compatibility tests for the built package.

## Purpose

These tests validate that the @accelint/geo package works correctly in real browsers. Unlike unit tests which run in Node.js, these tests run in a Chromium browser using Playwright to catch browser-specific issues.

## How It Works

1. **Build**: Package is built using `pnpm build` (via `tsup.config.ts`)

2. **Test**: Browser test loads the built package and validates all coordinate systems work correctly

3. **Validation**: Tests confirm:
   - The package works correctly in browsers
   - All coordinate systems (DD, DDM, DMS, MGRS, UTM) can parse and convert coordinates
   - No runtime errors occur

## Expected Behavior

### Browser Compatibility Test
- ✅ Should PASS - No browser errors
- ✅ All coordinate systems work correctly
- ✅ Console shows successful execution for each coordinate system
- ✅ Completes quickly (sets `window.testsComplete = true`)

## Smart Completion Detection

Tests use a signal-based completion mechanism instead of arbitrary timeouts:

- **HTML pages** set `window.testsComplete = true` when done
- **Test framework** polls for this flag every 100ms
- **Timeout fallback** of 5 seconds prevents hanging if flag is never set
- **Fast execution** - Tests complete as soon as they're done, not after a fixed delay

## Architecture

The test framework uses a factory pattern:

```javascript
const browser = await chromium.launch({ headless: true });
const [test, onComplete] = createTestSuite(browser);

// Run test
await test('Test Name', 'http://...', (result) => {
  return result.success; // Return true for pass, false for fail
});

// Get results
onComplete(({ failing, passing }) => {
  console.log(`Passed: ${passing}, Failed: ${failing}`);
});
```

Benefits:
- **Automatic result tracking** - No manual counting needed
- **Shared browser instance** - Efficient resource usage
- **Clean separation** - Test framework is reusable
- **Type-safe** - Full JSDoc documentation

## Common Issues

**If the test fails:**
- Check that the package builds successfully with `pnpm build`
- Verify the `dist/` directory exists and contains the built files
- Look for specific error messages in the test output
- Ensure geodesy dependencies are properly resolved

**If tests hang:**
- Check that the HTTP server port (8765) isn't already in use
- Verify the `dist/` directory exists
- Ensure the HTML test file sets `window.testsComplete = true` when done
- Look for the 5-second timeout warning in console output

## Exit Codes

- **0**: All tests passed (package is browser-compatible)
- **1**: Some tests failed (package has browser compatibility issues)
