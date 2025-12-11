# Bundle Size Analysis

This document tracks the bundle size of the `@accelint/geo` package to monitor performance and identify regressions.

**Last Updated:** November 24, 2025

### Bundle Size Comparison

| Metric                           | Before (with geodesy) | Current (standalone) | Change                |
| -------------------------------- | --------------------- | -------------------- | --------------------- |
| **Package only (minified)**      | 13.6 KB               | 15.2 KB              | +1.6 KB (+11.8%)      |
| **Package only (gzipped)**       | 4.8 KB                | 5.98 KB              | +1.18 KB (+24.6%)     |
| **With dependencies (minified)** | 33.2 KB               | 15.2 KB              | **-18.0 KB (-54.2%)** |
| **With dependencies (gzipped)**  | 11.1 KB               | 5.98 KB              | **-5.12 KB (-46.1%)** |
| **Runtime dependencies**         | geodesy@2.4.0         | None                 | Removed               |
| **Source files (unminified)**    | ~16 KB (35 files)     | 136 KB (64 files)    | +120 KB (+29 files)   |

### Summary
- ✅ **Removed geodesy dependency** - eliminated 18.6 KB (5.5 KB gzipped) of external code
- ✅ **56.0% smaller total bundle** when including dependencies
- ✅ Package is now **fully self-contained** with no runtime dependencies
- The standalone implementation is slightly larger (+1.0 KB) but eliminates the need for external dependencies
- Overall **net benefit**: Users download significantly less code

## How to Measure

To reproduce these measurements:

```bash
# Without dependencies (geodesy external)
pnpm exec esbuild packages/geo/dist/index.js --bundle --minify --format=esm --outfile=/tmp/geo-bundle-no-deps.js --external:geodesy

# With all dependencies
pnpm exec esbuild packages/geo/dist/index.js --bundle --minify --format=esm --outfile=/tmp/geo-bundle-with-deps.js

# Check gzipped sizes
gzip -c /tmp/geo-bundle-no-deps.js | wc -c
gzip -c /tmp/geo-bundle-with-deps.js | wc -c
```
