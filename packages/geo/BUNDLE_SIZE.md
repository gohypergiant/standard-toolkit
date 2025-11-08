# Bundle Size Analysis

This document tracks the bundle size of the `@accelint/geo` package to monitor performance and identify regressions.

**Last Updated:** November 8, 2025

### Bundle Size Comparison

| Metric                           | Before (with geodesy) | After (standalone) | Change                |
| -------------------------------- | --------------------- | ------------------ | --------------------- |
| **Package only (minified)**      | 13.6 KB               | 14.2 KB            | +0.6 KB (+4.4%)       |
| **Package only (gzipped)**       | 4.8 KB                | 5.4 KB             | +0.6 KB (+12.5%)      |
| **With dependencies (minified)** | 33.2 KB               | 14.2 KB            | **-19.0 KB (-57.2%)** |
| **With dependencies (gzipped)**  | 11.1 KB               | 5.4 KB             | **-5.7 KB (-51.4%)**  |
| **Runtime dependencies**         | geodesy@2.4.0         | None               | Removed               |
| **Source files (unminified)**    | ~16 KB (35 files)     | 132 KB (60 files)  | +116 KB (+25 files)   |

### Summary
- ✅ **Removed geodesy dependency** - eliminated 19.6 KB (6.3 KB gzipped) of external code
- ✅ **57.2% smaller total bundle** when including dependencies
- ✅ Package is now **fully self-contained** with no runtime dependencies
- The standalone implementation is slightly larger (+0.6 KB) but eliminates the need for external dependencies
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
