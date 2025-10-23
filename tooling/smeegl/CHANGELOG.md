# @accelint/smeegl

## 0.3.3

### Patch Changes

- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.

## 0.3.2

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling

## 0.3.1

### Patch Changes

- db83f28: added newline to react template

## 0.3.0

### Minor Changes

- 8bc2d53: - Deprecated positional arguments (non-breaking changes)
  - Added support to use a base input folder to search for .svg files (rather than a glob pattern)
  - Added support to export a set of React Components in the output folder

## 0.2.0

### Minor Changes

- Updated tool for creating spritesheets
- Deduplicating file names when folders are used
- Added unit tests for gathering common root path, for handling folder prefixes
- Added option to use CRC32 for index file for spritesheet/sprite names, either as HEX or DEC

## 0.1.0

### Minor Changes

- 0fafa9f: Add new CLI tool for creating spritesheets
