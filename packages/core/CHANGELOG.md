# @accelint/core

## 0.5.0

### Minor Changes

- 525a5a6: Open-source the safe-enum package, making it available to consumers as part of the @accelint/core package.

### Patch Changes

- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.

## 0.4.2

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling

## 0.4.1

### Patch Changes

- 5206880: Linting fixes only.

## 0.4.0

### Minor Changes

- cdd91b3: Change `compose` and `pipe` to accept a n-ary function in the last/first position, respectively

## 0.3.0

### Minor Changes

- 83104ea: Added UUID utilities and type for Tagged/Branded string type enforcement

## 0.2.2

### Patch Changes

- ca3922a: added subpath exports for packages

## 0.2.1

### Patch Changes

- f1073bf: Fix a copy paste typo in the reduce call

## 0.2.0

### Minor Changes

- d2ed24c: Clean up some of the functions and flesh out code documentation.
- 50ed3fd: Added a function to create an iterable and added a `range` iterable.

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
