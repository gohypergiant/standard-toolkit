# @accelint/converters

## 0.3.3

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling
- Updated dependencies [64280a7]
  - @accelint/constants@0.1.6

## 0.3.2

### Patch Changes

- 83104ea: Refactored ViewStack to be event driven, allowing for triggers anywhere in the app
- Updated dependencies [83104ea]
  - @accelint/constants@0.1.5

## 0.3.1

### Patch Changes

- Updated dependencies [ca3922a]
  - @accelint/constants@0.1.4

## 0.3.0

### Minor Changes

- ef11767: Adjust name for bounding box conversion

## 0.2.0

### Minor Changes

- 13f0d6c: The `toBoolean` function (packages/converters) centralizes the logic for coercing a value
  to a boolean which enables the predicate functions (packages/predicates/src/is-noyes) to
  be more specific in what they compare against rather than them simply being alias names
  to broad validation. The available predicates are now:
  - `isAnyFalsy`
  - `isAnyTruthy`
  - `isFalse`
  - `isTrue`
  - `isOn`
  - `isOff`
  - `isNo`
  - `isYes`

## 0.1.3

### Patch Changes

- f117ea6: Converted build step to use `tsup`.
- d39c5d8: Added explicit file extensions to relative path imports via esbuild plugin for tsup.
- Updated dependencies [f117ea6]
- Updated dependencies [d39c5d8]
  - @accelint/predicates@0.1.3
  - @accelint/constants@0.1.3

## 0.1.2

### Patch Changes

- 2c661d3: Standardized package.json "exports" field
- Updated dependencies [2c661d3]
  - @accelint/predicates@0.1.2
  - @accelint/constants@0.1.2

## 0.1.1

### Patch Changes

- 017c16e: Fixed publishing artifacts.
- Updated dependencies [017c16e]
  - @accelint/constants@0.1.1
  - @accelint/predicates@0.1.1

## 0.1.0

### Minor Changes

- eba7ce9: Initial release.

### Patch Changes

- Updated dependencies [eba7ce9]
  - @accelint/constants@0.1.0
  - @accelint/predicates@0.1.0
