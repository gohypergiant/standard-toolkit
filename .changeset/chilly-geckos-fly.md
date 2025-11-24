---
"@accelint/design-toolkit": major
"@accelint/design-foundation": major
"@accelint/prettier-config": minor
---

This release contains a number of breaking changes and will require some migration steps. For detailed information about why the changes were made and how to migrate, [consult our v8 migration guide](https://design-toolkit.accelint.io/?path=/docs/upgrade-guides--playground).

Breaking Changes:
* Removed support for Tailwind Variants in Design Foundation - functions `tv`, `mergeVariants` and `twMerge` are no longer exported
* Badge & Chip prop `variant` is renamed to `color` to align with Button 
* Popover structure updated – PopoverTrigger is now the root; triggerable elements and popover content must be direct children. 
* `sudo:` custom variant utility removed.

Improvements:
* CSS Modules is now the primary styling solution
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
  
