# @accelint/predicates

## 0.2.2

### Patch Changes

- Updated dependencies [f1073bf]
  - @accelint/core@0.2.1

## 0.2.1

### Patch Changes

- Updated dependencies [d2ed24c]
- Updated dependencies [50ed3fd]
  - @accelint/core@0.2.0

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

### Patch Changes

- 4ceec7e: Improve performance of is-noyes.

## 0.1.3

### Patch Changes

- f117ea6: Converted build step to use `tsup`.
- d39c5d8: Added explicit file extensions to relative path imports via esbuild plugin for tsup.
- Updated dependencies [f117ea6]
- Updated dependencies [d39c5d8]
  - @accelint/core@0.1.3

## 0.1.2

### Patch Changes

- 2c661d3: Standardized package.json "exports" field
- Updated dependencies [2c661d3]
  - @accelint/core@0.1.2

## 0.1.1

### Patch Changes

- 017c16e: Fixed publishing artifacts.
- Updated dependencies [017c16e]
  - @accelint/core@0.1.1

## 0.1.0

### Minor Changes

- eba7ce9: Initial release.

### Patch Changes

- Updated dependencies [eba7ce9]
  - @accelint/core@0.1.0
