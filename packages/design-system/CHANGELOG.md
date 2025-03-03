# @accelint/design-system

## 0.5.0

### Minor Changes

- 49e188d: - Adds read-only tree node concept
  - Updated design system documentation links
  - Updated PR template

### Patch Changes

- 302b3c9: Enforces design system theme z-index ordering for popover component
- 67b134a: Added support in Drawer component for controlled tab open and onSelectionChange event
- e9b8f66: Changes import to use design system useContextProps hook
- Updated dependencies [13f0d6c]
  - @accelint/converters@0.2.0

## 0.4.0

### Minor Changes

- 0fbebb8: Added orientation prop to QueryBuilder component

### Patch Changes

- 6d3aeb3: Refactored design system build to not bundle all JS, added testbed application to validate implementation and protect against breaking changes

## 0.3.3

### Patch Changes

- 67fc606: Switched to using peer dependencies
- caa626d: Update deps to pull from deps of react stately directly
- b27ccd7: Fixed issue with Tree causing duplicate keys on state update

## 0.3.2

### Patch Changes

- c2ac31b: Fix lodash imports to not use named exports

## 0.3.1

### Patch Changes

- 5b20f69: Added missing type exports to vanilla file

## 0.3.0

### Minor Changes

- 79752fa: Adds TextField and NumberField components to the design system

### Patch Changes

- 3dfc12a: Replaced Rollup with TSup for bundling
  - @accelint/converters@0.1.3

## 0.2.1

### Patch Changes

- f117ea6: Converted build step to use `tsup`.
- Updated dependencies [f117ea6]
- Updated dependencies [d39c5d8]
  - @accelint/converters@0.1.3

## 0.2.0

### Minor Changes

- 9f32b78: Updated options and menu to include border radius

### Patch Changes

- 2c661d3: Standardized package.json "exports" field
- 4e30129: Fixed bug where classnames didn't propagate for query builder component.
- abd8387: Fixed vanilla export by including all types
- Updated dependencies [2c661d3]
  - @accelint/converters@0.1.2

## 0.1.1

### Patch Changes

- 017c16e: Fixed publishing artifacts.
- Updated dependencies [017c16e]
  - @accelint/converters@0.1.1

## 0.1.0

### Minor Changes

- eba7ce9: Initial release.

### Patch Changes

- Updated dependencies [eba7ce9]
  - @accelint/converters@0.1.0
