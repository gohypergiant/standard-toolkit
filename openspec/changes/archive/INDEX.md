# Archived Changes

| Change | Date | Decision | Specs touched | Status |
| --- | --- | --- | --- | --- |
| add-stepper-component | 2026-08-26 | Custom useStepperState hook; Key type with stepper-specific naming; Separate Back/Next components; Bidirectional completion tracking; Disabled steps block navigation; ARIA wizard pattern; Conditional panel rendering | stepper-state-management, stepper-navigation, stepper-accessibility, stepper-styling, stepper-composition | current |
| add-table-density-variant | 2026-09-01 | Shared DensityVariant union in lib/types aliased by Tree/List/Menu/Accordion; Table takes the full cozy 12px / compact 8px / crammed 2px padding ladder; prop -> context -> styles[variant] plumbing with explicit CSS blocks; cells and meta columns get the density class, rows none, kebab menus clamped to compact; one DEFAULT_TABLE_VARIANT constant feeds prop and context defaults; dead Tree variant CSS left untouched; custom-children mode renders cozy via the context default | density-variant-type, table-density | current |
