# Package Compatibility Layer - @ngageoint

This directory contains compatibility fixes for the `@ngageoint` packages (`mgrs-js`, `grid-js`) to enable them to work in modern browser environments with ESM strict mode.

## The Problem

### Issue 1: CommonJS in Browser Environments

The `@ngageoint` packages are CommonJS modules, which can cause issues when used in browser environments that expect ESM (ECMAScript Modules). The build configuration bundles these dependencies and converts them to ESM format.

**Solution**: Bundle the packages during build (configured in `tsup.config.ts`)
- Bundle size increased but ensures browser compatibility
- All code is tree-shakeable and uses pure ESM

### Issue 2: Implicit Global Variables in js_cols

The minified `js_cols.min.js` uses implicit globals:
```javascript
js_cols = { ... }  // No var/let/const declaration
```

This fails in ESM strict mode (used by browsers) with:
```
ReferenceError: js_cols is not defined
```

### Issue 3: Invalid Comma Operator Usage in js_cols

The code attempts to access a variable while it's still being declared:
```javascript
var js_cols = {...}, js_cols.UID_PROPERTY_ = ...
```

This causes:
```
SyntaxError: Unexpected token '.'
```

## The Solution

We apply two code transformations to the `js_cols` library:

1. **Add variable declaration**: `js_cols = {` → `var js_cols = {`
2. **Fix statement separator**: `} }, js_cols.` → `} }; js_cols.`

These transformations are applied during the build process using custom plugins for both development (Vite/Storybook) and production (esbuild/tsup) builds.

## Architecture

### Files

- **`transform.ts`** - Core transformation logic (shared between plugins)
  - `applyTransform(code: string)` - Applies the transformations
  - `needsTransform(code: string)` - Detects if code needs transformation

- **`vite-plugin.ts`** - Vite plugin for Storybook development builds
  - Uses `enforce: 'post'` to run after dependency optimization
  - Transforms bundled chunks in memory

- **`esbuild-plugin.ts`** - esbuild plugin for production builds (via tsup)
  - Intercepts `js_cols.min.js` file during bundle
  - Transforms source before bundling

- **`index.ts`** - Convenient exports for easier imports

### How It Works

**For Storybook (Development)**:
- The Vite plugin transforms code after Vite's dependency pre-bundling
- Runs in `transform` hook with `enforce: 'post'`
- Checks each transformed chunk for the problematic pattern
- Applies fixes on-the-fly

**For Production Builds**:
- The esbuild plugin intercepts the `js_cols.min.js` file
- Reads the file, applies transformations, returns fixed code
- Bundle includes the corrected version
- All CommonJS modules converted to ESM

### Trade-offs

**Pros:**
- ✅ Browser compatibility is ensured
- ✅ No runtime CommonJS/ESM interop issues
- ✅ All code is tree-shakeable
- ✅ Single module format (ESM) throughout
- ✅ Centralized transformation logic
- ✅ No duplication between dev and prod builds

**Cons:**
- ⚠️ Bundle size increased by including @ngageoint packages
- ⚠️ Consumers cannot deduplicate `@ngageoint` packages
- ⚠️ Build time slightly increased due to bundling
