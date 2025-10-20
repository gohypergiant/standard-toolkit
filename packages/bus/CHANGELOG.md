# @accelint/bus

## 1.4.0

### Minor Changes

- ccb2d05: Added a source property to the event payload to help identify where an event originated from

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling
- Updated dependencies [64280a7]
  - @accelint/core@0.4.2

## 1.3.0

### Minor Changes

- 6374c68: Update event bus to target audiences such as 'all', 'others', 'self'. As well as individual contexts via a uuid.

### Patch Changes

- b11870c: - **Fixed** Updated documentation to correctly reference React hooks from the `@accelint/bus/react` module.

## 1.2.0

### Minor Changes

- 55718af: made event payload optional

## 1.1.0

### Minor Changes

- e767f7c: Create React hooks for events with type safety and render safety

## 1.0.0

### Major Changes

- 0457dc6: enabled strict typing for Broadcast class and getInstance method

## 0.1.2

### Patch Changes

- 83104ea: Refactored ViewStack to be event driven, allowing for triggers anywhere in the app

## 0.1.1

### Patch Changes

- ca3922a: added subpath exports for packages

## 0.1.0

### Minor Changes

- b022126: Initial release.
