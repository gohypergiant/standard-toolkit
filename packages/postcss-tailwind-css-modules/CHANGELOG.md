# @accelint/postcss-tailwind-css-modules

## 1.1.0

### Minor Changes

- f321eb4: Add support for peer/ classes
  - Add support for Tailwind `peer/` classes alongside existing `group/` class support
  - Update documentation to reflect peer/ class support
  - Rename internal function from `globalGroupPlugin` to `tailwindCssModulesPlugin`
  - Add comprehensive test coverage (37 tests) with inline snapshots

## 1.0.1

### Patch Changes

- bb73a1e: Ensure dependencies all follow the same semver range across devtk, maptk, and designtk.

## 1.0.0

### Major Changes

- 01bdf1e: Initial implementation of postcss plugin for resolving some problems that occur when using tailwind with css modules
