# @accelint/formatters

## 0.2.0

### Minor Changes

- 663abd1: - Implement `formatBearing()` and add `formatDistance()`.
  - `formatBearing(degrees)` formats a bearing value as a zero-padded 3-digit string with a degree symbol (e.g. `45` → `"045°"`). Wraps negative values and values over 360 into the `0–360` range with `wrap()` from `@accelint/math`, and rounds fractional bearings to the nearest whole degree. Throws a `RangeError` for `NaN` or infinite input.
  - `formatDistance(meters, units)` converts a distance in meters to a human-readable string. Accepts a single unit (`'kilometers'` → `"42.3 km"`) or dual units (`['kilometers', 'nauticalmiles']` → `"42.3 km / 22.8 NM"`). Conversion uses `METERS_PER_UNIT` and symbols use `DISTANCE_UNIT_SYMBOLS`, both from `@accelint/constants/units`. Throws an `Error` for an empty unit list, more than two units, or an unsupported unit, and a `RangeError` for `NaN` or infinite `meters`.

### Patch Changes

- Updated dependencies [663abd1]
  - @accelint/constants@0.4.0

## 0.1.9

### Patch Changes

- bb73a1e: Ensure dependencies all follow the same semver range across devtk, maptk, and designtk.

## 0.1.8

### Patch Changes

- 34c42a0: Swap bundling to tsdown and auto generate exports entries in package.json.

## 0.1.7

### Patch Changes

- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.

## 0.1.6

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling

## 0.1.5

### Patch Changes

- 83104ea: Refactored ViewStack to be event driven, allowing for triggers anywhere in the app

## 0.1.4

### Patch Changes

- ca3922a: added subpath exports for packages

## 0.1.3

### Patch Changes

- f117ea6: Converted build step to use `tsup`.
- d39c5d8: Added explicit file extensions to relative path imports via esbuild plugin for tsup.

## 0.1.2

### Patch Changes

- 2c661d3: Standardized package.json "exports" field

## 0.1.1

### Patch Changes

- 017c16e: Fixed publishing artifacts.

## 0.1.0

### Minor Changes

- eba7ce9: Initial release.
