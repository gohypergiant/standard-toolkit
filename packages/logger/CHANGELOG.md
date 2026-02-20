# @accelint/logger

## 1.0.0

### Major Changes

- ed09ea6: 1. Added in https://loglayer.dev/log-level-managers/one-way.html to facilitate unique child logger levels 2. Updated tests to verify a few assertions we had with regards to getLogger() singleton pattern (and more) 3. Updated documentation to showcase some additional patterns 4. Updated all dependencies to latest 5. Added support for Groups feature https://loglayer.dev/logging-api/groups.html 6. Swap to structured logger when in production mode 7. Remove type export `LOG_LEVEL` (breaking change), this was just a re-export from `loglayer` and was technically a TS enum which we try and avoid. Since we already export each individual log level as a const this felt a little redundant.

## 0.1.5

### Patch Changes

- d328b71: Moved definitions from JERIC2O to here for additional usability and added additional exports.
  Updated related packages as well.

## 0.1.4

### Patch Changes

- bb73a1e: Ensure dependencies all follow the same semver range across devtk, maptk, and designtk.

## 0.1.3

### Patch Changes

- 34c42a0: Swap bundling to tsdown and auto generate exports entries in package.json.

## 0.1.2

### Patch Changes

- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.

## 0.1.1

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling

## 0.1.0

### Minor Changes

- af51513: Package release.
