# Root Cause Analysis: js_cols ESM Compatibility Issues

## Problem Summary

The `@ngageoint` packages (`mgrs-js`, `grid-js`) fail in modern browser environments due to ESM strict mode incompatibilities in their transitive dependency `js_cols`.

## Dependency Chain

```
@ngageoint/mgrs-js
  └─ @ngageoint/grid-js
      └─ @ngageoint/simple-features-js
          └─ js_cols@1.0.1 ⚠️ ROOT CAUSE
```

## The Issues in js_cols

### Issue 1: Implicit Global Variable
**File:** `js_cols.min.js`  
**Problem:** Uses implicit global assignment without declaration
```javascript
js_cols = { ... }  // Missing var/let/const
```
**Error in ESM strict mode:**
```
ReferenceError: js_cols is not defined
```

### Issue 2: Invalid Comma Operator
**Problem:** Attempts to access variable while it's being declared
```javascript
var js_cols = {...}, js_cols.UID_PROPERTY_ = ...
```
**Error:**
```
SyntaxError: Unexpected token '.'
```

## Package Information

### js_cols
- **Repository:** https://github.com/thomasstjerne/js_cols
- **npm:** https://www.npmjs.com/package/js_cols
- **Version:** 1.0.1
- **Last Published:** 11 years ago (2014)
- **Maintainer:** Thomas Stjernegaard Jeppesen (thomasstjerne)
- **License:** Listed as "none" (repository may have separate LICENSE file)
- **Weekly Downloads:** ~3,363
- **Status:** ⚠️ Abandoned/unmaintained

### @ngageoint/simple-features-js
- **Repository:** https://github.com/ngageoint/simple-features-js
- **Direct dependency:** `js_cols@1.0.1`
- **Maintainer:** National Geospatial-Intelligence Agency (NGA)
- **License:** MIT
- **Status:** Active (last updated ~3 years ago)
- **Note:** Government project with "unlimited rights"

### @ngageoint/grid-js
- **Repository:** https://github.com/ngageoint/grid-js
- **Direct dependency:** `@ngageoint/simple-features-js`
- **Maintainer:** NGA
- **License:** MIT

### @ngageoint/mgrs-js
- **Repository:** https://github.com/ngageoint/mgrs-js
- **Direct dependency:** `@ngageoint/grid-js`
- **Maintainer:** NGA
- **License:** MIT

## Current Solution (Temporary)

We've implemented a build-time transformation layer in this directory that:
1. Adds variable declarations: `js_cols = {` → `var js_cols = {`
2. Fixes statement separators: `} }, js_cols.` → `} }; js_cols.`

This works but is a **workaround**, not a permanent solution.

## Recommended Actions for Upstream Fix

### Option 1: Fix at NGA Level ⭐ **RECOMMENDED**

**Target:** `@ngageoint/simple-features-js`  
**Action:** Submit PR to https://github.com/ngageoint/simple-features-js

**Suggested approaches:**

#### A. Replace js_cols with modern alternatives
Replace the 11-year-old `js_cols` with:
- Built-in JavaScript `Map`, `Set`, `WeakMap`, `WeakSet`
- Modern maintained libraries (if specific data structures are needed)

**Pros:**
- Eliminates the root cause permanently
- Better performance with native implementations
- No maintenance burden from ancient dependencies

**Cons:**
- Requires code changes in `simple-features-js`
- May need significant testing

#### B. Fork and fix js_cols under @ngageoint namespace
Create `@ngageoint/js_cols` with the fixes applied

**Pros:**
- Minimal changes to `simple-features-js` (just update dependency)
- NGA controls the dependency
- Can publish ESM version

**Cons:**
- Adds maintenance burden
- Fork management overhead

#### C. Apply build-time transformations
Similar to our current solution, but at the package level

**Pros:**
- Minimal code changes
- Preserves original `js_cols` behavior

**Cons:**
- Build complexity
- Not a "real" fix

### Option 2: Fix js_cols Directly

**Target:** `js_cols`  
**Action:** Submit PR to https://github.com/thomasstjerne/js_cols

**Pros:**
- Fixes root cause for all users
- Benefits entire ecosystem

**Cons:**
- ⚠️ Package abandoned 11 years ago
- Maintainer likely unresponsive
- High risk of PR being ignored
- Even if merged, requires @ngageoint to update their dependencies

**Recommendation:** Only pursue as a secondary action, don't rely on it

### Option 3: Do Both

1. **Immediate:** Submit issue/PR to `@ngageoint/simple-features-js` (Option 1A or 1B)
2. **Secondary:** Submit issue to `js_cols` for visibility/historical record
3. **Link them together** so community can track the full chain

## Benefits of Upstream Fix

If an upstream fix is implemented:
- ✅ We can remove our compatibility layer entirely
- ✅ Other projects using `@ngageoint` packages benefit
- ✅ Reduces our maintenance burden
- ✅ Improves the broader ecosystem
- ✅ Bundle size could be optimized (no need to bundle @ngageoint packages)
- ✅ Consumers could deduplicate dependencies

## Timeline Estimate

- **Option 1A (Replace js_cols):** 2-4 weeks (if NGA responsive)
- **Option 1B (Fork js_cols):** 1-2 weeks (if NGA responsive)
- **Option 2 (Fix js_cols):** Unlikely to happen
- **Our workaround:** Works now, maintain until upstream fix

## Next Steps

1. ✅ Document the issue (this file)
2. ⏭️ Prepare detailed PR for `@ngageoint/simple-features-js`
   - Include transformation code
   - Document the ESM strict mode issues
   - Suggest Option 1A or 1B
   - Provide test cases
3. ⏭️ Open issue in `js_cols` for historical record
4. ⏭️ Monitor NGA response
5. ⏭️ If no response in 4-6 weeks, consider reaching out via other channels

## References

- [js_cols on npm](https://www.npmjs.com/package/js_cols)
- [js_cols on GitHub](https://github.com/thomasstjerne/js_cols)
- [@ngageoint/simple-features-js](https://github.com/ngageoint/simple-features-js)
- [@ngageoint/grid-js](https://github.com/ngageoint/grid-js)
- [@ngageoint/mgrs-js](https://github.com/ngageoint/mgrs-js)
- [ESM Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- [CommonJS vs ESM](https://nodejs.org/api/esm.html)

## Contact Information

If submitting PRs, consider mentioning:
- **NGA Contributors:**
  - @gillandk (Kevin Gilland)
  - @caldwellc
- **js_cols Maintainer:**
  - @thomasstjerne (Thomas Stjernegaard Jeppesen)

---

**Last Updated:** October 16, 2025  
**Status:** Workaround implemented, upstream fix pending
