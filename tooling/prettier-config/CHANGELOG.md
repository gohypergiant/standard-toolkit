# @accelint/prettier-config

## 0.2.0
### Minor Changes

- f3a9fb3: This release contains a number of breaking changes and will require some migration steps. For detailed information about why the changes were made and how to migrate, [consult our v8 migration guide](https://design-toolkit.accelint.io/?path=/docs/upgrade-guides--playground).
  
  Breaking Changes:
  * Removed support for Tailwind Variants in Design Foundation - functions `tv`, `mergeVariants` and `twMerge` are no longer exported
  * Badge & Chip prop `variant` is renamed to `color` to align with Button
  * Popover structure updated – PopoverTrigger is now the root; triggerable elements and popover content must be direct children.
  * `sudo:` custom variant utility removed.
  
  Improvements:
  * Introducing CSS modules as another tool for working with Tailwind
  * Components now use 1–3 core classes instead of large utility sets.
  * State-based styles are applied only when active, reducing DOM noise.
  * Variant syntax updated: use @variant blocks with @apply instead of chained selectors.
  * CSS layer system expanded: `components.l1–l5` for controlled style precedence; use higher layers (l3–l5) or @utilities for overrides.
  * Improved CSS validation – invalid class names now throw errors during compilation.
  * Eliminated CPU-intensive TV/tw-merge resolution; runtime performance improved at scale.
  
  New Features:
  * Added additional custom variants: extend-left/right/top/bottom, push-left/right/top/bottom.
  * Action Bar: added size prop for flexible usage.
  
  Migration Guide:
  * [Visit the v8 migration guide](https://design-toolkit.accelint.io/?path=/docs/upgrade-guides--playground) for detailed information about migration
  * CSS Modules are required – Next.js supports out-of-the-box; other frameworks may need setup.
  * Named group classes (group/*) must not be hashed – use provided generateScopedClassName (Vite) or getLocalIdent (Webpack/Next.js).
  * Use `clsx` exported from the DTK for conditional class composition rather than `tv` at the path `@accelint/design-foundation/lib/utils`
  * When using css modules in your application, avoid composes – external composes bypass Tailwind processing
- f3a9fb3: Add prettier config to format CSS with Tailwind class name sorting

## 0.1.4

### Patch Changes

- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.

## 0.1.3

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling

## 0.1.2

### Patch Changes

- 2c661d3: Standardized package.json "exports" field

## 0.1.1

### Patch Changes

- 017c16e: Fixed publishing artifacts.

## 0.1.0

### Minor Changes

- eba7ce9: Initial release.
