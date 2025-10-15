# Browser Compatibility Testing

This directory contains browser compatibility tests for the built package.

## Purpose

These tests validate that the compatibility transforms applied during the build process are actually fixing browser issues. Unlike unit tests which run in Node.js, these tests run in a real Chromium browser to catch browser-specific problems.

## How It Works

1. **Two Builds**:
   - `dist/` - Built WITH compatibility transforms (via `tsup.config.ts`)
   - `dist-no-transforms/` - Built WITHOUT transforms (via `tsup.config.no-transforms.ts`)

2. **Two Tests**:
   - **Positive Test**: Confirms `dist/` works without errors
   - **Negative Test**: Confirms `dist-no-transforms/` FAILS with errors

3. **Validation**: If both tests pass, we know:
   - The transforms are fixing real issues (negative test detects errors)
   - The package works correctly in browsers (positive test passes)

## Expected Behavior

### Positive Test (dist/ WITH transforms)
- ✅ Should PASS - No browser errors
- ✅ All coordinate systems work correctly
- ✅ Console shows successful execution
- ✅ Completes quickly (sets `window.testsComplete = true`)

### Negative Test (dist-no-transforms/ WITHOUT transforms)
- ✅ Should detect errors - Specifically `js_cols is not defined`
- ✅ Proves the transforms are necessary and working
- ✅ Console shows the compatibility issue
- ✅ Completes immediately (fails during module import)

## Smart Completion Detection

Tests use a signal-based completion mechanism instead of arbitrary timeouts:

- **HTML pages** set `window.testsComplete = true` when done
- **Test framework** polls for this flag every 100ms
- **Timeout fallback** of 5 seconds prevents hanging if flag is never set
- **Fast execution** - Tests complete as soon as they're done, not after a fixed delay

This approach is much more reliable and efficient than waiting a fixed amount of time.

## Architecture

The test framework uses a factory pattern:

```javascript
const browser = await chromium.launch({ headless: true });
const [test, onComplete] = createTestSuite(browser);

// Run tests
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

**If the negative test doesn't fail:**
- The transforms might not be doing anything
- Check that `ngageoint.createEsbuildPlugin()` is in `tsup.config.ts`
- Check that it's NOT in `tsup.config.no-transforms.ts`

**If the positive test fails:**
- The transforms might not be working correctly
- Check the compat plugin configuration
- Look for specific error messages in the test output

**If tests hang:**
- Check that the HTTP server port (8765) isn't already in use
- Verify both `dist/` and `dist-no-transforms/` directories exist
- Ensure HTML test files set `window.testsComplete = true` when done
- Look for the 5-second timeout warning in console output

## Exit Codes

- **0**: All tests passed (transforms work, package is browser-compatible)
- **1**: Some tests failed (either transforms don't work or package has issues)
