# Browser Compatibility

## Problem

The `@accelint/geo` package depends on two external libraries from `@ngageoint`:
- `@ngageoint/grid-js`
- `@ngageoint/mgrs-js`

These packages are built as **CommonJS** modules, which can cause compatibility issues when used in browser environments that expect **ESM** (ECMAScript Modules).

## Solution

The build configuration has been updated to **bundle** these CommonJS dependencies and convert them to ESM format during the build process. This ensures browser compatibility while maintaining the ESM module format for the `@accelint/geo` package.

### Changes Made

1. **Updated `tsup.config.ts`**:
   - Changed `bundle: false` to `bundle: true`
   - Added `noExternal: ['@ngageoint/grid-js', '@ngageoint/mgrs-js']` to force bundling of these packages
   - The bundler automatically handles the CommonJS to ESM conversion

### How It Works

When building with `bundle: true`:
- The `@ngageoint` packages are included in the output chunks
- CommonJS constructs (`require`, `exports`, etc.) are converted to ESM equivalents
- The conversion is handled by esbuild's built-in `__toESM` helper
- The result is pure ESM that works in both Node.js and browsers

### Trade-offs

**Pros:**
- ✅ Browser compatibility is ensured
- ✅ No runtime CommonJS/ESM interop issues
- ✅ All code is tree-shakeable
- ✅ Single module format (ESM) throughout

**Cons:**
- ⚠️ Bundle size increased (the `@ngageoint` packages are ~1.37 MB)
- ⚠️ Consumers cannot deduplicate `@ngageoint` packages if they also use them
- ⚠️ Build time slightly increased due to bundling

### Alternative Approaches Considered

1. **Keep as external dependencies**: Would require consumers to handle CommonJS/ESM interop themselves
2. **Conditional exports**: Would require maintaining both CommonJS and ESM builds
3. **Request upstream changes**: The `@ngageoint` packages would need to publish ESM builds

The chosen approach (bundling) provides the best user experience while maintaining compatibility.
